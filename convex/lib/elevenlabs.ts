/**
 * ElevenLabs HMAC webhook signature verification.
 *
 * Header format (per ElevenLabs docs): `t=<unix_secs>,v0=<hex_sha256_hmac>`
 * The HMAC is computed over `${t}.${rawBody}` using the webhook secret.
 *
 * Web Crypto is async; constant-time compare is byte-by-byte after a length
 * guard so total runtime depends only on the trusted-side length.
 */

export type SignatureResult =
  | { ok: true; timestamp: number }
  | { ok: false; reason: string };

const DEFAULT_TOLERANCE_SECS = 30 * 60;

function parseHeader(
  header: string,
): { t: number; v0: string } | { error: string } {
  const parts = header.split(",").map((s) => s.trim());
  let t: number | null = null;
  let v0: string | null = null;
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const k = part.slice(0, eq);
    const val = part.slice(eq + 1);
    if (k === "t") {
      const parsed = Number(val);
      if (!Number.isFinite(parsed)) return { error: "invalid_timestamp" };
      t = parsed;
    } else if (k === "v0") {
      v0 = val;
    }
  }
  if (t === null) return { error: "missing_timestamp" };
  if (v0 === null) return { error: "missing_signature" };
  return { t, v0 };
}

function hexToBytes(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    const byte = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    if (!Number.isFinite(byte)) return null;
    out[i] = byte;
  }
  return out;
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  return diff === 0;
}

export async function computeHmacSha256Hex(
  secret: string,
  data: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data),
  );
  const bytes = new Uint8Array(sig);
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return hex;
}

export async function verifySignature(
  rawBody: string,
  header: string | null,
  secret: string,
  nowSecs: number,
  toleranceSecs: number = DEFAULT_TOLERANCE_SECS,
): Promise<SignatureResult> {
  if (!header) return { ok: false, reason: "missing_header" };
  const parsed = parseHeader(header);
  if ("error" in parsed) return { ok: false, reason: parsed.error };

  const drift = Math.abs(nowSecs - parsed.t);
  if (drift > toleranceSecs) return { ok: false, reason: "timestamp_drift" };

  const expectedHex = await computeHmacSha256Hex(
    secret,
    `${parsed.t}.${rawBody}`,
  );
  const a = hexToBytes(expectedHex);
  const b = hexToBytes(parsed.v0);
  if (!a || !b) return { ok: false, reason: "invalid_signature_format" };
  if (!constantTimeEqual(a, b))
    return { ok: false, reason: "signature_mismatch" };

  return { ok: true, timestamp: parsed.t };
}

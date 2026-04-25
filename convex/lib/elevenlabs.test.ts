import { describe, expect, it } from "vitest";
import { computeHmacSha256Hex, verifySignature } from "./elevenlabs";

const SECRET = "wsec_test_secret";
const NOW = 1735000000;
const BODY = '{"hello":"world"}';

async function makeHeader(t: number, body: string, secret: string) {
  const sig = await computeHmacSha256Hex(secret, `${t}.${body}`);
  return `t=${t},v0=${sig}`;
}

describe("verifySignature", () => {
  it("accepts a valid signature within tolerance", async () => {
    const header = await makeHeader(NOW, BODY, SECRET);
    const result = await verifySignature(BODY, header, SECRET, NOW);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.timestamp).toBe(NOW);
  });

  it("rejects when the body has been tampered with", async () => {
    const header = await makeHeader(NOW, BODY, SECRET);
    const result = await verifySignature(
      `${BODY}-tampered`,
      header,
      SECRET,
      NOW,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("signature_mismatch");
  });

  it("rejects when the secret is wrong", async () => {
    const header = await makeHeader(NOW, BODY, SECRET);
    const result = await verifySignature(BODY, header, "different", NOW);
    expect(result.ok).toBe(false);
  });

  it("rejects when the timestamp is outside tolerance", async () => {
    const header = await makeHeader(NOW - 60 * 60, BODY, SECRET);
    const result = await verifySignature(BODY, header, SECRET, NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("timestamp_drift");
  });

  it("rejects when the header is missing", async () => {
    const result = await verifySignature(BODY, null, SECRET, NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("missing_header");
  });

  it("rejects when v0 is missing", async () => {
    const result = await verifySignature(BODY, `t=${NOW}`, SECRET, NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("missing_signature");
  });
});

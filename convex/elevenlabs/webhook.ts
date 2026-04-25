import { internal } from "../_generated/api";
import { httpAction } from "../_generated/server";
import { verifySignature } from "../lib/elevenlabs";
import { normalize } from "./adapter";

const PROVIDER = "elevenlabs";

async function sha256Hex12(body: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(body),
  );
  const bytes = new Uint8Array(buf);
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return hex.slice(0, 12);
}

export const handleElevenLabsWebhook = httpAction(async (ctx, request) => {
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;
  if (!secret) {
    console.error(
      "ELEVENLABS_WEBHOOK_SECRET is not set on the Convex deployment",
    );
    return new Response("Server misconfigured", { status: 500 });
  }

  const rawBody = await request.text();
  const sigHeader =
    request.headers.get("ElevenLabs-Signature") ??
    request.headers.get("elevenlabs-signature");

  const result = await verifySignature(
    rawBody,
    sigHeader,
    secret,
    Math.floor(Date.now() / 1000),
  );
  if (!result.ok) {
    console.warn(`ElevenLabs webhook rejected: ${result.reason}`);
    return new Response("Invalid signature", { status: 401 });
  }

  const rawStorageId = await ctx.storage.store(
    new Blob([rawBody], { type: "application/json" }),
  );

  let envelope: unknown;
  try {
    envelope = JSON.parse(rawBody);
  } catch {
    await ctx.runMutation(internal.webhookEvents.log, {
      provider: PROVIDER,
      eventType: "invalid_json",
      providerConversationId: null,
      orgId: null,
      status: "error",
      errorMessage: "invalid_json_body",
      rawPayloadStorageId: rawStorageId,
    });
    return new Response(null, { status: 200 });
  }

  const env = envelope as {
    type?: unknown;
    data?: { conversation_id?: unknown };
  };
  const eventType = typeof env.type === "string" ? env.type : "unknown";
  const providerConversationId =
    typeof env.data?.conversation_id === "string"
      ? env.data.conversation_id
      : null;

  if (eventType === "post_call_audio") {
    await ctx.runMutation(internal.webhookEvents.log, {
      provider: PROVIDER,
      eventType,
      providerConversationId,
      orgId: null,
      status: "ignored",
      errorMessage: "audio_event_not_handled",
      rawPayloadStorageId: rawStorageId,
    });
    return new Response(null, { status: 200 });
  }

  if (
    eventType !== "post_call_transcription" &&
    eventType !== "call_initiation_failure"
  ) {
    await ctx.runMutation(internal.webhookEvents.log, {
      provider: PROVIDER,
      eventType,
      providerConversationId,
      orgId: null,
      status: "ignored",
      errorMessage: "unknown_event_type",
      rawPayloadStorageId: rawStorageId,
    });
    return new Response(null, { status: 200 });
  }

  try {
    const bodyHash12 = await sha256Hex12(rawBody);
    const normalized = normalize(envelope, bodyHash12);
    const ingest = await ctx.runMutation(
      internal.conversations.ingestFromWebhook,
      { normalized, rawStorageId },
    );

    if (ingest.outcome === "unknown_agent") {
      await ctx.runMutation(internal.webhookEvents.log, {
        provider: PROVIDER,
        eventType,
        providerConversationId,
        orgId: null,
        status: "ignored",
        errorMessage: "unknown_agent",
        rawPayloadStorageId: rawStorageId,
      });
    } else if (ingest.outcome === "duplicate_active_agent") {
      await ctx.runMutation(internal.webhookEvents.log, {
        provider: PROVIDER,
        eventType,
        providerConversationId,
        orgId: null,
        status: "error",
        errorMessage: "duplicate_active_agent",
        rawPayloadStorageId: rawStorageId,
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("ElevenLabs ingest failed", err);
    await ctx.runMutation(internal.webhookEvents.log, {
      provider: PROVIDER,
      eventType,
      providerConversationId,
      orgId: null,
      status: "error",
      errorMessage: message,
      rawPayloadStorageId: rawStorageId,
    });
  }

  return new Response(null, { status: 200 });
});

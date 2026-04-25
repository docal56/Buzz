/**
 * ElevenLabs post-call webhook envelope → stable internal NormalizedConversation.
 * The rest of the system never sees ElevenLabs field paths.
 */

export type NormalizedConversation = {
  channel: "call";
  provider: "elevenlabs";
  providerEventType: string;
  kind: "transcription" | "initiation_failure";
  providerConversationId: string | null;
  providerDedupeKey: string;
  providerStatus: string;

  occurredAtUnixSecs: number;

  subject: string | null;
  bodyText: string | null;
  messages: Array<{
    role: string;
    body: string;
    senderName: string | null;
    occurredAtUnixSecs: number | null;
    timeInCallSecs: number | null;
  }> | null;

  callAgentExternalId: string | null;
  callFromNumber: string | null;
  callToNumber: string | null;
  callDurationSecs: number | null;
  callSuccessful: "success" | "failure" | "unknown" | null;

  dataCollectionResultsRaw: unknown;
};

type RawTranscriptItem = {
  role?: unknown;
  message?: unknown;
  source_message?: unknown;
  source?: unknown;
  speaker_name?: unknown;
  time_in_call_secs?: unknown;
  time_in_call?: unknown;
  start_time_unix_secs?: unknown;
};

type RawEnvelope = {
  type?: unknown;
  event_timestamp?: unknown;
  data?: {
    agent_id?: unknown;
    conversation_id?: unknown;
    status?: unknown;
    transcript?: unknown;
    metadata?: {
      start_time_unix_secs?: unknown;
      call_duration_secs?: unknown;
      phone_call?: {
        external_number?: unknown;
        agent_number?: unknown;
        from_number?: unknown;
        to_number?: unknown;
      };
    };
    analysis?: {
      data_collection_results?: unknown;
      call_successful?: unknown;
    };
  };
};

const MAX_MESSAGES = 100;
const MAX_MESSAGE_BODY_CHARS = 2_000;
const MAX_BODY_TEXT_CHARS = 50_000;

function asString(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function asNumber(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) : s;
}

function normalizeMessages(raw: unknown): NormalizedConversation["messages"] {
  if (!Array.isArray(raw)) return null;
  const out: NonNullable<NormalizedConversation["messages"]> = [];
  for (const item of raw as RawTranscriptItem[]) {
    if (out.length >= MAX_MESSAGES) break;
    if (!item || typeof item !== "object") continue;
    const body = asString(item.message) ?? asString(item.source_message) ?? "";
    if (body.length === 0) continue;
    const role = asString(item.role) ?? asString(item.source) ?? "unknown";
    out.push({
      role,
      body: truncate(body, MAX_MESSAGE_BODY_CHARS),
      senderName: asString(item.speaker_name),
      occurredAtUnixSecs: asNumber(item.start_time_unix_secs),
      timeInCallSecs:
        asNumber(item.time_in_call_secs) ?? asNumber(item.time_in_call),
    });
  }
  return out;
}

function normalizeCallSuccessful(
  v: unknown,
): NormalizedConversation["callSuccessful"] {
  if (v === "success" || v === "failure" || v === "unknown") return v;
  return null;
}

export function normalize(
  envelope: unknown,
  rawBodyHash12: string,
): NormalizedConversation {
  const env = (envelope ?? {}) as RawEnvelope;
  const data = env.data ?? {};

  const eventType = asString(env.type) ?? "unknown";
  const kind: NormalizedConversation["kind"] =
    eventType === "call_initiation_failure"
      ? "initiation_failure"
      : "transcription";

  const providerConversationId = asString(data.conversation_id);
  const eventTs = asNumber(env.event_timestamp);
  const startTs = asNumber(data.metadata?.start_time_unix_secs);
  const occurredAtUnixSecs =
    startTs ?? eventTs ?? Math.floor(Date.now() / 1000);

  const dedupeKey =
    providerConversationId ??
    `${eventType}:${asString(data.agent_id) ?? "no-agent"}:${eventTs ?? 0}:${rawBodyHash12}`;

  const messages = normalizeMessages(data.transcript);
  const bodyText = messages
    ? truncate(
        messages.map((m) => `${m.senderName ?? m.role}: ${m.body}`).join("\n"),
        MAX_BODY_TEXT_CHARS,
      )
    : null;

  const phone = data.metadata?.phone_call ?? {};
  const fromNumber =
    asString((phone as { from_number?: unknown }).from_number) ??
    asString((phone as { external_number?: unknown }).external_number);
  const toNumber =
    asString((phone as { to_number?: unknown }).to_number) ??
    asString((phone as { agent_number?: unknown }).agent_number);

  return {
    channel: "call",
    provider: "elevenlabs",
    providerEventType: eventType,
    kind,
    providerConversationId,
    providerDedupeKey: dedupeKey,
    providerStatus: asString(data.status) ?? "unknown",

    occurredAtUnixSecs,

    subject: null,
    bodyText: bodyText && bodyText.length > 0 ? bodyText : null,
    messages,

    callAgentExternalId: asString(data.agent_id),
    callFromNumber: fromNumber,
    callToNumber: toNumber,
    callDurationSecs: asNumber(data.metadata?.call_duration_secs),
    callSuccessful: normalizeCallSuccessful(data.analysis?.call_successful),

    dataCollectionResultsRaw: data.analysis?.data_collection_results ?? null,
  };
}

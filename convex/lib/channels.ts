export const CHANNELS = ["call", "email", "chat"] as const;
export type Channel = (typeof CHANNELS)[number];

export const PROVIDERS = ["elevenlabs", "gmail", "web_chat"] as const;
export type Provider = (typeof PROVIDERS)[number];

export function isChannel(value: string): value is Channel {
  return (CHANNELS as readonly string[]).includes(value);
}

export function isProvider(value: string): value is Provider {
  return (PROVIDERS as readonly string[]).includes(value);
}

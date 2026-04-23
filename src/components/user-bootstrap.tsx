"use client";

import { useStoreUserEffect } from "@/hooks/use-store-user-effect";

export function UserBootstrap() {
  useStoreUserEffect();
  return null;
}

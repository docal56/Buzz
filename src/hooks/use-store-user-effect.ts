"use client";

import { useAuth } from "@clerk/nextjs";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function useStoreUserEffect() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { orgId } = useAuth();
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    // Read orgId so this effect re-fires when Clerk's active org switches.
    // The mutation reads the active org from the JWT server-side; orgId is trigger-only here.
    void orgId;
    if (!isAuthenticated) return;
    let cancelled = false;
    storeUser().then((id) => {
      if (!cancelled) setUserId(id);
    });
    return () => {
      cancelled = true;
      setUserId(null);
    };
  }, [isAuthenticated, orgId, storeUser]);

  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null,
  };
}

"use client";

import { useConvexAuth, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function useStoreUserEffect() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    storeUser().then((id) => {
      if (!cancelled) setUserId(id);
    });
    return () => {
      cancelled = true;
      setUserId(null);
    };
  }, [isAuthenticated, storeUser]);

  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null,
  };
}

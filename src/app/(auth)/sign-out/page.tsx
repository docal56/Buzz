"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Page() {
  const { signOut } = useClerk();

  useEffect(() => {
    void signOut({ redirectUrl: "/" });
  }, [signOut]);

  return <p className="text-muted-foreground text-sm">Signing you out…</p>;
}

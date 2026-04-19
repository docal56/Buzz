"use client";

import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-medium">Property Management</h1>

      <Unauthenticated>
        <div className="flex gap-3">
          <SignInButton mode="modal">
            <button className="rounded border border-zinc-300 px-4 py-2 hover:bg-zinc-50">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="rounded bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800">
              Sign up
            </button>
          </SignUpButton>
        </div>
      </Unauthenticated>

      <Authenticated>
        <SignedInPanel />
      </Authenticated>
    </main>
  );
}

function SignedInPanel() {
  const me = useQuery(api.users.currentUser);

  return (
    <div className="flex flex-col items-center gap-4">
      <UserButton />
      <div className="rounded border border-zinc-200 bg-zinc-50 p-4 text-sm">
        <div className="mb-1 font-medium">Convex query result:</div>
        <pre className="text-xs">{JSON.stringify(me, null, 2)}</pre>
      </div>
    </div>
  );
}

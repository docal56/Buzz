"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const messages = useQuery(api.messages.list);

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <section className="w-full max-w-xl">
        <p className="mb-3 font-mono text-sm text-zinc-500">Buzz</p>
        <h1 className="text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">
          Next.js and Convex are ready.
        </h1>
        <p className="mt-5 text-lg leading-8 text-zinc-600">
          This is a clean starter app connected to a Convex backend. The next
          decision is what Buzz should do first.
        </p>
        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Convex response</p>
          <p className="mt-2 text-zinc-950">
            {messages?.[0]?.text ?? "Loading backend connection..."}
          </p>
        </div>
      </section>
    </main>
  );
}

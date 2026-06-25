"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <div className="mt-8 flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="outline">Sign in</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Create account</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Convex response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
            {messages?.[0]?.text ?? "Loading backend connection..."}
          </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

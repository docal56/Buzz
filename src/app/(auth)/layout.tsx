import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted p-8">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <h1 className="font-medium text-2xl text-foreground">Buzz</h1>
        {children}
      </div>
    </main>
  );
}

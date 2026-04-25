import type { ReactNode } from "react";
import { Sidebar } from "./_sidebar";

export default function ComponentsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-2xl py-2xl">{children}</div>
      </main>
    </div>
  );
}

"use client";

import { MainNav } from "@/components/patterns/main-nav";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";

export function MainNavDemo() {
  return (
    <div className="flex h-demo-viewport overflow-hidden rounded-md border border-border bg-background">
      <MainNav
        logo={<Logo />}
        sections={[
          {
            id: "manage",
            title: "Manage",
            items: [
              {
                id: "open-issues",
                label: "Open Issues",
                href: "/",
                icon: <Icon name="issues" size="md" />,
              },
            ],
          },
          {
            id: "monitor",
            title: "Monitor",
            items: [
              {
                id: "call-logs",
                label: "Call Logs",
                href: "/call-logs",
                icon: <Icon name="call-incoming" size="md" />,
              },
            ],
          },
        ]}
      />
      <div className="flex flex-1 items-center justify-center bg-background text-12 text-foreground-subtle">
        Page content area
      </div>
    </div>
  );
}

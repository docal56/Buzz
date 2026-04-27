"use client";

import { useState } from "react";
import { AppShell, PageContent } from "@/components/patterns/app-shell";
import { MainNav } from "@/components/patterns/main-nav";
import { PageHeaderList } from "@/components/patterns/page-header-list";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";

export function AppShellDemo() {
  const [query, setQuery] = useState("");

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <AppShell
        className="h-demo-viewport"
        nav={
          <MainNav
            logo={<Logo />}
            sections={[
              {
                id: "manage",
                title: "Manage",
                items: [
                  {
                    id: "issues",
                    label: "Issues",
                    href: "/issues",
                    icon: <Icon name="issues" size="md" />,
                  },
                ],
              },
              {
                id: "monitor",
                title: "Monitor",
                items: [
                  {
                    id: "calls",
                    label: "Call Monitor",
                    href: "/calls",
                    icon: <Icon name="call-incoming" size="md" />,
                  },
                ],
              },
            ]}
          />
        }
      >
        <PageContent
          header={
            <PageHeaderList
              onSearchChange={setQuery}
              searchPlaceholder="Search issues"
              searchValue={query}
              title="Open Issues"
              titleIcon={<Icon name="issues" size="md" />}
            />
          }
        >
          <div className="flex min-h-0 flex-1 items-center justify-center p-lg text-12 text-foreground-subtle">
            Main Container — fill with page-specific content (Kanban, Table,
            Detail view, etc.)
          </div>
        </PageContent>
      </AppShell>
    </div>
  );
}

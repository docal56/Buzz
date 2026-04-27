"use client";

import { ClerkLoaded, ClerkLoading, OrganizationSwitcher } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/patterns/app-shell";
import { MainNav, type MainNavSection } from "@/components/patterns/main-nav";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const navSections: MainNavSection[] = [
  {
    id: "manage",
    title: "Manage",
    items: [
      {
        id: "issues",
        label: "Issues",
        href: "/issues",
        matchPaths: ["/issues"],
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
];

function OrganizationSlot() {
  return (
    <div className="min-w-0 flex-1">
      <ClerkLoading>
        <div className="h-9 w-full animate-pulse rounded-md bg-hover" />
      </ClerkLoading>
      <ClerkLoaded>
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/issues"
          afterSelectOrganizationUrl="/issues"
          appearance={{
            elements: {
              rootBox: "w-full",
              organizationSwitcherTrigger:
                "w-full justify-between rounded-md px-md py-md text-14 font-medium leading-120 text-foreground hover:bg-hover",
              organizationPreviewTextContainer: "min-w-0",
              organizationPreviewMainIdentifier:
                "truncate text-14 font-medium leading-120 text-foreground",
              organizationSwitcherTriggerIcon: "text-foreground-muted",
            },
          }}
          hidePersonal
        />
      </ClerkLoaded>
    </div>
  );
}

function SidebarFooter() {
  const pathname = usePathname() ?? "";
  const active = pathname === "/settings";

  return (
    <div className="flex items-center gap-md">
      <OrganizationSlot />
      <Link
        aria-label="Settings"
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-md",
          "bg-transparent text-foreground-muted hover:bg-hover hover:text-foreground",
          "transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active && "text-foreground",
        )}
        href="/settings"
      >
        <Icon name="settings" size="md" />
      </Link>
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      nav={
        <MainNav
          footer={<SidebarFooter />}
          logo={<Logo />}
          sections={navSections}
        />
      }
    >
      {children}
    </AppShell>
  );
}

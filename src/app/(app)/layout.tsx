"use client";

import {
  ClerkLoaded,
  ClerkLoading,
  OrganizationSwitcher,
  UserButton,
} from "@clerk/nextjs";
import type { ReactNode } from "react";
import { AppShell } from "@/components/patterns/app-shell";
import { MainNav, type MainNavSection } from "@/components/patterns/main-nav";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";

const navSections: MainNavSection[] = [
  {
    id: "manage",
    title: "Manage",
    items: [
      {
        id: "open-issues",
        label: "Open Issues",
        href: "/",
        matchPaths: ["/open-issues"],
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
];

function OrganizationSlot() {
  return (
    <div className="min-h-10">
      <ClerkLoading>
        <div className="h-9 w-full animate-pulse rounded-md bg-hover" />
      </ClerkLoading>
      <ClerkLoaded>
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          appearance={{
            elements: {
              rootBox: "w-full",
              organizationSwitcherTrigger:
                "w-full justify-between rounded-md border border-border bg-surface px-md py-md text-14 font-medium leading-120 text-foreground shadow-subtle hover:bg-hover",
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

function UserSlot() {
  return (
    <div className="min-h-10 border-border border-t pt-md">
      <ClerkLoading>
        <div className="h-9 w-full animate-pulse rounded-md bg-hover" />
      </ClerkLoading>
      <ClerkLoaded>
        <UserButton
          appearance={{
            elements: {
              rootBox: "w-full",
              userButtonBox:
                "w-full gap-md rounded-md px-md py-md text-14 font-medium leading-120 text-foreground hover:bg-hover",
              userButtonTrigger: "order-first rounded-full focus:shadow-none",
              userButtonOuterIdentifier:
                "order-last min-w-0 flex-1 truncate pl-0 text-left text-14 font-medium leading-120 text-foreground",
              avatarBox: "size-7",
            },
          }}
          showName
        />
      </ClerkLoaded>
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      nav={
        <MainNav
          footer={<UserSlot />}
          logo={<Logo />}
          organizationSlot={<OrganizationSlot />}
          sections={navSections}
        />
      }
    >
      {children}
    </AppShell>
  );
}

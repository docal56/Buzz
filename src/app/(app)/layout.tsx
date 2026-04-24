"use client";

import {
  ClerkLoaded,
  ClerkLoading,
  OrganizationSwitcher,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MenuItem } from "@/components/composed/menu-item";
import { MenuSection } from "@/components/composed/menu-section";
import { IconCallIncoming, IconInbox } from "@/components/ui/icons";

const navItems = [
  { href: "/", label: "Open Issues", icon: <IconInbox /> },
  { href: "/call-logs", label: "Call Logs", icon: <IconCallIncoming /> },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh bg-muted">
      <aside className="flex w-60 shrink-0 flex-col gap-3 border-border border-r bg-background p-2">
        <div className="flex h-10 items-center px-1">
          <ClerkLoading>
            <div className="h-7 w-full animate-pulse rounded-md bg-subtle" />
          </ClerkLoading>
          <ClerkLoaded>
            <OrganizationSwitcher
              afterCreateOrganizationUrl="/"
              afterSelectOrganizationUrl="/"
              appearance={{ elements: { rootBox: "w-full" } }}
              hidePersonal
            />
          </ClerkLoaded>
        </div>
        <MenuSection>
          {navItems.map((item) => (
            <MenuItem
              active={pathname === item.href}
              asChild
              icon={item.icon}
              key={item.href}
              label={item.label}
            >
              <Link href={item.href} />
            </MenuItem>
          ))}
        </MenuSection>
        <div className="mt-auto flex h-11 items-center border-border border-t px-1 pt-2">
          <ClerkLoading>
            <div className="h-8 w-full animate-pulse rounded-md bg-subtle" />
          </ClerkLoading>
          <ClerkLoaded>
            <UserButton
              appearance={{
                elements: {
                  rootBox: "w-full",
                  userButtonBox:
                    "w-full gap-2 rounded-md px-2 py-1 hover:bg-subtle",
                  userButtonTrigger:
                    "order-first rounded-full focus:shadow-none",
                  userButtonOuterIdentifier:
                    "order-last grow text-sm text-foreground font-medium pl-0",
                  avatarBox: "size-7",
                },
              }}
              showName
            />
          </ClerkLoaded>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

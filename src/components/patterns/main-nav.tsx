"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MainNavItemSpec = {
  id: string;
  icon: ReactNode;
  label: ReactNode;
  href: string;
  matchPaths?: string[];
};

export type MainNavSection = {
  id: string;
  title: ReactNode;
  items: MainNavItemSpec[];
};

type MainNavProps = {
  sections: MainNavSection[];
  logo?: ReactNode;
  organizationSlot?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

function matchesPath(pathname: string, path: string): boolean {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function isActive(
  pathname: string,
  href: string,
  matchPaths?: string[],
): boolean {
  if (matchesPath(pathname, href)) return true;
  return matchPaths?.some((p) => matchesPath(pathname, p)) ?? false;
}

export function MainNav({
  sections,
  logo,
  organizationSlot,
  footer,
  className,
}: MainNavProps) {
  const pathname = usePathname() ?? "";

  return (
    <nav
      aria-label="Main"
      className={cn(
        "flex h-full w-main-nav shrink-0 flex-col gap-9 px-md py-base",
        className,
      )}
    >
      <div className="flex flex-col gap-base">
        {logo ? (
          <div className="flex h-7 items-center gap-md px-xs">{logo}</div>
        ) : null}
        {organizationSlot ? (
          <div className="px-xs">{organizationSlot}</div>
        ) : null}
      </div>
      {sections.map((section) => (
        <div className="flex flex-col gap-base" key={section.id}>
          <div className="flex items-center px-md">
            <span className="font-medium text-13 text-foreground-muted leading-120">
              {section.title}
            </span>
          </div>
          <ul className="flex flex-col gap-xs">
            {section.items.map((item) => {
              const active = isActive(pathname, item.href, item.matchPaths);
              return (
                <li key={item.id}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-10 w-full items-center gap-md rounded-md p-md",
                      "font-medium text-14 leading-120",
                      "transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "border-[length:var(--border-hairline)] border-border bg-surface text-foreground shadow-subtle"
                        : "border-[length:var(--border-hairline)] border-transparent bg-transparent text-foreground-muted hover:bg-hover hover:text-foreground",
                    )}
                    data-active={active || undefined}
                    href={item.href}
                  >
                    <span className="flex shrink-0 items-center">
                      {item.icon}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-left">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {footer ? <div className="mt-auto px-xs">{footer}</div> : null}
    </nav>
  );
}

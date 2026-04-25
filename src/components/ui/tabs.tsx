"use client";

import { Tabs as RadixTabs } from "radix-ui";
import type { ComponentProps, Ref } from "react";
import { cn } from "@/lib/utils";

type TabsProps = ComponentProps<typeof RadixTabs.Root>;

export function Tabs({ className, ...props }: TabsProps) {
  return (
    <RadixTabs.Root
      className={cn("flex flex-col gap-lg", className)}
      {...props}
    />
  );
}

type TabListProps = ComponentProps<typeof RadixTabs.List>;

export function TabList({ className, ...props }: TabListProps) {
  return (
    <RadixTabs.List
      className={cn(
        "inline-flex items-center border-border border-b",
        className,
      )}
      {...props}
    />
  );
}

type TabProps = Omit<ComponentProps<typeof RadixTabs.Trigger>, "ref"> & {
  ref?: Ref<HTMLButtonElement>;
};

export function Tab({ className, ref, ...props }: TabProps) {
  return (
    <RadixTabs.Trigger
      className={cn(
        "group/tab inline-flex flex-col items-center justify-center gap-md px-lg pt-md",
        "font-medium text-14 text-foreground-muted leading-120",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "data-[state=active]:text-foreground",
        className,
      )}
      ref={ref}
      {...props}
    >
      <span>{props.children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "-mb-px h-xxs w-full rounded-t-lg bg-foreground",
          "opacity-0 group-data-[state=active]/tab:opacity-100",
        )}
      />
    </RadixTabs.Trigger>
  );
}

type TabPanelProps = ComponentProps<typeof RadixTabs.Content>;

export function TabPanel({ className, ...props }: TabPanelProps) {
  return (
    <RadixTabs.Content
      className={cn("focus-visible:outline-none", className)}
      {...props}
    />
  );
}

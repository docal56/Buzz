"use client";

import { DropdownMenu } from "radix-ui";
import type { ComponentProps, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

type DropdownTriggerProps = Omit<
  ComponentProps<typeof DropdownMenu.Trigger>,
  "ref"
> & {
  leadingIcon?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
};

export function DropdownTrigger({
  leadingIcon,
  children,
  className,
  ref,
  ...props
}: DropdownTriggerProps) {
  return (
    <DropdownMenu.Trigger
      className={cn(
        "inline-flex items-center justify-center gap-md rounded-md bg-surface p-md",
        "border border-border",
        "font-medium text-14 text-foreground leading-120",
        "transition-colors hover:bg-hover",
        "data-[state=open]:bg-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      ref={ref}
      {...props}
    >
      {leadingIcon ? (
        <span className="flex shrink-0 items-center text-foreground-subtle [&>span]:size-5">
          {leadingIcon}
        </span>
      ) : null}
      <span>{children}</span>
      <span className="flex shrink-0 items-center text-foreground-subtle">
        <Icon name="chevron-down" size="md" />
      </span>
    </DropdownMenu.Trigger>
  );
}

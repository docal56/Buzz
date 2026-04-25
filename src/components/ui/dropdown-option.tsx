"use client";

import { DropdownMenu } from "radix-ui";
import type { ComponentProps, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

type DropdownOptionProps = Omit<
  ComponentProps<typeof DropdownMenu.Item>,
  "ref"
> & {
  icon?: ReactNode;
  selected?: boolean;
  ref?: Ref<HTMLDivElement>;
};

export function DropdownOption({
  icon,
  selected = false,
  children,
  className,
  ref,
  ...props
}: DropdownOptionProps) {
  return (
    <DropdownMenu.Item
      className={cn(
        "flex items-center gap-sm rounded-md px-md py-sm",
        "font-medium text-13 text-foreground-muted leading-120",
        "outline-none transition-colors",
        "data-[highlighted]:bg-hover data-[highlighted]:text-foreground",
        "data-[selected]:bg-hover data-[selected]:text-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        className,
      )}
      data-selected={selected || undefined}
      ref={ref}
      {...props}
    >
      {icon ? (
        <span className="flex shrink-0 items-center [&>span]:size-5">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">{children}</span>
      {selected ? (
        <span className="flex shrink-0 items-center text-foreground">
          <Icon name="check-circle" size="md" />
        </span>
      ) : null}
    </DropdownMenu.Item>
  );
}

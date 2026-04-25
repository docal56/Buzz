"use client";

import { DropdownMenu as RadixDropdownMenu } from "radix-ui";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DropdownMenuProps = {
  trigger: ReactNode;
  header?: ReactNode;
  children: ReactNode;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
};

export function DropdownMenu({
  trigger,
  header,
  children,
  align = "start",
  sideOffset = 4,
  className,
}: DropdownMenuProps) {
  return (
    <RadixDropdownMenu.Root>
      {trigger}
      <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.Content
          align={align}
          className={cn(
            "z-50 flex w-60 flex-col gap-base rounded-lg bg-surface px-md pt-lg pb-md",
            "shadow-default",
            className,
          )}
          sideOffset={sideOffset}
        >
          {header ? (
            <div className="flex items-center px-md font-medium text-14 text-foreground leading-120">
              {header}
            </div>
          ) : null}
          <div className="flex flex-col gap-sm">{children}</div>
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  );
}

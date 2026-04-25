"use client";

import { Switch } from "radix-ui";
import type { ComponentProps, Ref } from "react";
import { cn } from "@/lib/utils";

type ToggleProps = ComponentProps<typeof Switch.Root> & {
  ref?: Ref<HTMLButtonElement>;
};

export function Toggle({ className, ref, ...props }: ToggleProps) {
  return (
    <Switch.Root
      className={cn(
        "relative inline-flex h-5 w-8 shrink-0 items-center rounded-full p-xxs",
        "bg-border-strong data-[state=checked]:bg-primary",
        "transition-colors",
        "disabled:pointer-events-none disabled:opacity-40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      ref={ref}
      {...props}
    >
      <Switch.Thumb
        className={cn(
          "block size-4 rounded-full bg-surface shadow-subtle",
          "transition-transform",
          "data-[state=checked]:translate-x-base",
          "data-[state=unchecked]:translate-x-0",
        )}
      />
    </Switch.Root>
  );
}

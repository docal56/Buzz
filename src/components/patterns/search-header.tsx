"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type SearchHeaderProps = {
  query: ReactNode;
  onClear: () => void;
  label?: ReactNode;
  className?: string;
};

export function SearchHeader({
  query,
  onClear,
  label = "Showing results for",
  className,
}: SearchHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-8 items-center gap-md px-md pt-xs pb-md",
        className,
      )}
    >
      <button
        aria-label="Clear search"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-sm",
          "text-foreground transition-colors hover:text-foreground-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
        onClick={onClear}
        type="button"
      >
        <Icon name="x" size="md" />
      </button>
      <span className="font-medium text-14 text-foreground leading-[1.5]">
        {label} &lsquo;{query}&rsquo;
      </span>
    </div>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MetaChipProps = {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function MetaChip({ icon, children, className }: MetaChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-xs rounded-full bg-hover px-md py-xs",
        "font-medium text-12 text-foreground-muted leading-none",
        className,
      )}
    >
      {icon ? <span className="flex shrink-0 items-center">{icon}</span> : null}
      <span>{children}</span>
    </span>
  );
}

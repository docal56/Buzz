import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type InlineProps = {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Inline({ icon, children, className }: InlineProps) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-md", className)}>
      <span className="flex shrink-0 items-center">{icon}</span>
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

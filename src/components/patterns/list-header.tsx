import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ListHeaderProps = {
  title?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function ListHeader({ title, actions, className }: ListHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <span className="font-medium text-16 text-foreground leading-120">
        {title}
      </span>
      {actions ? (
        <div className="flex items-center gap-md">{actions}</div>
      ) : null}
    </div>
  );
}

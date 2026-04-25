import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DetailRowState = "default" | "placeholder";

type DetailRowProps = {
  icon?: ReactNode;
  children: ReactNode;
  state?: DetailRowState;
  className?: string;
};

export function DetailRow({
  icon,
  children,
  state = "default",
  className,
}: DetailRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-md py-md text-14 leading-120",
        state === "placeholder"
          ? "text-foreground-placeholder"
          : "text-foreground",
        className,
      )}
    >
      {icon ? <span className="flex shrink-0 items-center">{icon}</span> : null}
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
}

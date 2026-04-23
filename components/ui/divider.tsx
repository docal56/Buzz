import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation;
}

export function Divider({
  orientation = "horizontal",
  className,
  ...rest
}: DividerProps) {
  return (
    <div
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      role="separator"
      {...rest}
    />
  );
}

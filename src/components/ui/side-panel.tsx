import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SidePanelProps = ComponentProps<"div">;

export function SidePanelNarrow({ className, ...props }: SidePanelProps) {
  return (
    <div
      className={cn("flex w-side-panel-narrow flex-col", className)}
      {...props}
    />
  );
}

export function SidePanelMedium({ className, ...props }: SidePanelProps) {
  return (
    <div
      className={cn("flex w-side-panel-medium flex-col", className)}
      {...props}
    />
  );
}

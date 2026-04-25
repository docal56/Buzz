import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type LabelVariant = "destructive" | "success" | "warning" | "info";

type LabelProps = {
  variant?: LabelVariant;
  children: ReactNode;
  className?: string;
};

const variantClasses: Record<LabelVariant, string> = {
  destructive: "bg-destructive text-foreground-inverted",
  success: "bg-success text-foreground-inverted",
  warning: "bg-warning text-foreground-inverted",
  info: "bg-info text-foreground",
};

export function Label({
  variant = "destructive",
  children,
  className,
}: LabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full p-md",
        "font-semibold text-12 leading-none",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

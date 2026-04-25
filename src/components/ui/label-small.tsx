import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LabelVariant } from "./label";

type LabelSmallProps = {
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

export function LabelSmall({
  variant = "destructive",
  children,
  className,
}: LabelSmallProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-md py-sm",
        "font-medium text-12 leading-none",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

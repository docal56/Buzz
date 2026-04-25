import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  header?: ReactNode;
};

export function Card({ header, children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-base rounded-lg bg-surface p-lg shadow-subtle",
        "border-[length:var(--border-hairline)] border-border",
        className,
      )}
      {...props}
    >
      {header ? (
        <div className="flex items-center">
          <span className="font-medium text-16 text-foreground leading-120">
            {header}
          </span>
        </div>
      ) : null}
      {children ? (
        <div className="flex flex-col text-14 text-foreground leading-160">
          {children}
        </div>
      ) : null}
    </div>
  );
}

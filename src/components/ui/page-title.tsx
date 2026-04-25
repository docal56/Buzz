import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageTitleProps = {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PageTitle({ icon, children, className }: PageTitleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-md text-foreground",
        className,
      )}
    >
      <span className="flex shrink-0 items-center">{icon}</span>
      <span className="font-medium text-14 leading-120">{children}</span>
    </div>
  );
}

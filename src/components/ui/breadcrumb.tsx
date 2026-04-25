import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";

type BreadcrumbProps = {
  parent: ReactNode;
  current: ReactNode;
  onBack?: () => void;
  className?: string;
};

export function Breadcrumb({
  parent,
  current,
  onBack,
  className,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "inline-flex items-center gap-md text-14 leading-120",
        className,
      )}
    >
      <IconButton
        aria-label="Back"
        icon={<Icon name="arrow-left" size="md" />}
        onClick={onBack}
        size="sm"
      />
      <span className="text-foreground-muted">{parent}</span>
      <span aria-hidden="true" className="text-foreground-placeholder">
        /
      </span>
      <span className="font-medium text-foreground">{current}</span>
    </nav>
  );
}

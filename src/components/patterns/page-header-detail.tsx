import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

type PageHeaderDetailProps = {
  parent: ReactNode;
  current: ReactNode;
  onBack?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
};

export function PageHeaderDetail({
  parent,
  current,
  onBack,
  onPrev,
  onNext,
  className,
}: PageHeaderDetailProps) {
  return (
    <div
      className={cn(
        "flex h-12 items-center justify-between py-xs pr-md",
        className,
      )}
    >
      <Breadcrumb current={current} onBack={onBack} parent={parent} />
      <div className="flex shrink-0 items-center gap-xs">
        <IconButton
          aria-label="Previous"
          icon={<Icon name="arrow-up" size="sm" />}
          onClick={onPrev}
          size="sm"
        />
        <IconButton
          aria-label="Next"
          icon={<Icon name="arrow-down" size="sm" />}
          onClick={onNext}
          size="sm"
        />
      </div>
    </div>
  );
}

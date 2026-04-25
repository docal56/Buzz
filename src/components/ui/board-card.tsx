"use client";

import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";

type BoardCardProps = {
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  badge?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
};

export function BoardCard({
  title,
  description,
  timestamp,
  badge,
  selected = false,
  onClick,
  onMenuClick,
  className,
}: BoardCardProps) {
  const handleMenuClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onMenuClick?.();
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Board cards use div layout because some variants contain nested action buttons.
    <div
      className={cn(
        "relative flex w-board-card flex-col gap-lg rounded-md bg-surface p-lg",
        "border-[length:var(--border-hairline)] border-border",
        "shadow-subtle transition-shadow hover:shadow-hover",
        onClick && "cursor-pointer",
        "data-[selected]:ring-2 data-[selected]:ring-ring",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      data-selected={selected || undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex flex-col gap-base">
        <div className="flex items-start gap-md">
          <h3 className="min-w-0 flex-1 truncate font-medium text-14 text-foreground leading-120">
            {title}
          </h3>
          {onMenuClick ? (
            <IconButton
              aria-label="Open card menu"
              className="-mt-md -mr-md"
              icon={<Icon name="menu" size="sm" />}
              onClick={handleMenuClick}
              size="sm"
            />
          ) : null}
        </div>
        {description ? (
          <p className="font-regular text-12 text-foreground-muted leading-160">
            {description}
          </p>
        ) : null}
      </div>
      {timestamp || badge ? (
        <div className="flex h-7 items-center gap-xs">
          {timestamp ? (
            <span className="min-w-0 flex-1 truncate font-regular text-12 text-foreground-muted leading-160">
              {timestamp}
            </span>
          ) : null}
          {badge ? <span className="shrink-0">{badge}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

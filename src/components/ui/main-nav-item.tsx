import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

type MainNavItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "ref" | "children"
> & {
  icon: ReactNode;
  label: ReactNode;
  active?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

export function MainNavItem({
  icon,
  label,
  active = false,
  className,
  ref,
  type = "button",
  ...props
}: MainNavItemProps) {
  return (
    <button
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-10 w-full items-center gap-md rounded-md p-md",
        "font-medium text-14 leading-120",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-[length:var(--border-hairline)] border-border bg-surface text-foreground shadow-subtle"
          : "border-[length:var(--border-hairline)] border-transparent bg-transparent text-foreground-muted hover:bg-hover hover:text-foreground",
        className,
      )}
      data-active={active || undefined}
      ref={ref}
      type={type}
      {...props}
    >
      <span className="flex shrink-0 items-center">{icon}</span>
      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
    </button>
  );
}

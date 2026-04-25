import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

export type IconButtonSize = "md" | "sm";

type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "ref" | "children"
> & {
  icon: ReactNode;
  size?: IconButtonSize;
  "aria-label": string;
  ref?: Ref<HTMLButtonElement>;
};

const sizeClasses: Record<IconButtonSize, string> = {
  md: "p-md",
  sm: "p-sm",
};

export function IconButton({
  icon,
  size = "md",
  className,
  ref,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md",
        "bg-ghost text-foreground hover:bg-ghost-hover",
        "transition-colors",
        "disabled:pointer-events-none disabled:opacity-40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        sizeClasses[size],
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    >
      {icon}
    </button>
  );
}

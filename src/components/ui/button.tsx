import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> & {
  variant?: ButtonVariant;
  trailingIcon?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-foreground-inverted hover:bg-primary-hover",
  secondary:
    "bg-secondary text-foreground border border-border hover:bg-secondary-hover",
  ghost: "bg-ghost text-foreground hover:bg-ghost-hover",
  destructive:
    "bg-destructive text-foreground-inverted hover:bg-destructive-hover",
};

export function Button({
  variant = "primary",
  trailingIcon,
  children,
  className,
  ref,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-md rounded-md px-base py-md",
        "font-medium text-14 leading-120",
        "transition-colors",
        "disabled:pointer-events-none disabled:opacity-40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        variantClasses[variant],
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    >
      {children}
      {trailingIcon}
    </button>
  );
}

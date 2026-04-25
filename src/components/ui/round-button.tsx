import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

type RoundButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "ref" | "children"
> & {
  icon: ReactNode;
  "aria-label": string;
  ref?: Ref<HTMLButtonElement>;
};

export function RoundButton({
  icon,
  className,
  ref,
  type = "button",
  ...props
}: RoundButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full p-sm",
        "bg-primary text-foreground-inverted hover:bg-primary-hover",
        "transition-colors",
        "disabled:pointer-events-none disabled:opacity-40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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

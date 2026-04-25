import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "ref"> & {
  leadingIcon?: ReactNode;
  wrapperClassName?: string;
  ref?: Ref<HTMLInputElement>;
};

export function TextInput({
  leadingIcon,
  wrapperClassName,
  className,
  ref,
  type = "text",
  ...props
}: TextInputProps) {
  return (
    <div
      className={cn(
        "group inline-flex items-center gap-md rounded-md bg-surface p-md",
        "border border-border",
        "text-14 text-foreground leading-120",
        "transition-colors",
        "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring",
        "has-[:disabled]:pointer-events-none has-[:disabled]:opacity-40",
        wrapperClassName,
      )}
    >
      {leadingIcon ? (
        <span className="flex shrink-0 items-center text-foreground-muted transition-colors group-focus-within:text-foreground">
          {leadingIcon}
        </span>
      ) : null}
      <input
        className={cn(
          "min-w-0 flex-1 bg-transparent outline-none",
          "placeholder:text-foreground-placeholder",
          className,
        )}
        ref={ref}
        type={type}
        {...props}
      />
    </div>
  );
}

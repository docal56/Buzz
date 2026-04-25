import type { Ref, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "ref"
> & {
  ref?: Ref<HTMLTextAreaElement>;
};

export function Textarea({ className, ref, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "block w-full resize-none rounded-md bg-surface p-md",
        "border border-border",
        "text-14 text-foreground leading-160",
        "outline-none transition-colors",
        "placeholder:text-foreground-placeholder",
        "focus:border-ring focus:ring-2 focus:ring-ring",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
}

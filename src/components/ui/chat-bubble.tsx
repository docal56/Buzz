import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ChatBubbleVariant = "incoming" | "outgoing";

type ChatBubbleProps = {
  variant?: ChatBubbleVariant;
  children: ReactNode;
  className?: string;
};

const variantClasses: Record<ChatBubbleVariant, string> = {
  incoming: "bg-hover",
  outgoing: "bg-surface border border-border",
};

export function ChatBubble({
  variant = "incoming",
  children,
  className,
}: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "inline-flex max-w-chat-bubble items-start rounded-md px-lg py-md",
        "text-14 text-foreground leading-160",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}

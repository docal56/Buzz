import type { ReactNode } from "react";
import {
  ChatBubble,
  type ChatBubbleVariant,
} from "@/components/ui/chat-bubble";
import { cn } from "@/lib/utils";

export type TranscriptMessage = {
  id: string;
  variant: ChatBubbleVariant;
  body: ReactNode;
};

type TranscriptViewProps = {
  messages: TranscriptMessage[];
  callDuration?: ReactNode;
  className?: string;
};

export function TranscriptView({
  messages,
  callDuration,
  className,
}: TranscriptViewProps) {
  return (
    <div className={cn("flex flex-col gap-xl", className)}>
      {callDuration ? (
        <p className="font-medium text-14 text-foreground leading-120">
          Call duration: {callDuration}
        </p>
      ) : null}
      <div className="flex flex-col gap-lg">
        {messages.map((message) => (
          <div
            className={cn(
              "flex",
              message.variant === "outgoing" ? "justify-end" : "justify-start",
            )}
            key={message.id}
          >
            <ChatBubble variant={message.variant}>{message.body}</ChatBubble>
          </div>
        ))}
      </div>
    </div>
  );
}

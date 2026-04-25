import { Avatar as RadixAvatar } from "radix-ui";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AvatarTone = "purple" | "orange" | "teal" | "pink" | "light-blue";

type AvatarProps = { className?: string } & (
  | { variant: "image"; src?: string; alt: string }
  | {
      variant: "icon";
      tone: AvatarTone;
      icon: ReactNode;
      "aria-label"?: string;
    }
);

const toneClasses: Record<AvatarTone, string> = {
  purple: "bg-purple-100 border-purple-200 text-purple-300",
  orange: "bg-orange-100 border-orange-200 text-orange-300",
  teal: "bg-teal-100 border-teal-200 text-teal-300",
  pink: "bg-pink-100 border-pink-200 text-pink-300",
  "light-blue": "bg-light-blue-100 border-light-blue-200 text-light-blue-300",
};

export function Avatar(props: AvatarProps) {
  const { className } = props;

  if (props.variant === "icon") {
    return (
      <span
        aria-label={props["aria-label"]}
        className={cn(
          "inline-flex size-6 items-center justify-center rounded-full border p-xs",
          toneClasses[props.tone],
          className,
        )}
        role="img"
      >
        {props.icon}
      </span>
    );
  }

  return (
    <RadixAvatar.Root
      className={cn(
        "inline-flex size-6 select-none items-center justify-center overflow-hidden rounded-full border border-border bg-border align-middle",
        className,
      )}
    >
      {props.src ? (
        <RadixAvatar.Image
          alt={props.alt}
          className="size-full object-cover"
          src={props.src}
        />
      ) : null}
      <RadixAvatar.Fallback
        aria-label={props.alt}
        className="flex size-full items-center justify-center bg-border"
        delayMs={0}
      />
    </RadixAvatar.Root>
  );
}

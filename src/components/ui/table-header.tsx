import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type TableHeaderProps = HTMLAttributes<HTMLDivElement>;

export function TableHeader({
  children,
  className,
  ...props
}: TableHeaderProps) {
  return (
    // biome-ignore lint/a11y/useFocusableInteractive: Flex table rows are exposed for screen readers but are not independently interactive.
    // biome-ignore lint/a11y/useSemanticElements: Flex layout is required for the design-system table primitive.
    <div
      className={cn(
        "flex items-center gap-base border-border border-b bg-background px-lg py-base",
        className,
      )}
      role="row"
      {...props}
    >
      {children}
    </div>
  );
}

type TableHeadProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function TableHead({ children, className, ...props }: TableHeadProps) {
  return (
    // biome-ignore lint/a11y/useFocusableInteractive: Flex table headers are structural, not keyboard-interactive controls.
    // biome-ignore lint/a11y/useSemanticElements: Flex layout is required for the design-system table primitive.
    <div
      className={cn(
        "flex items-center font-medium text-13 text-foreground-subtle leading-120",
        className,
      )}
      role="columnheader"
      {...props}
    >
      {children}
    </div>
  );
}

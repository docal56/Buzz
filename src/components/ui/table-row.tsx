import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TableRowState = "default" | "hover" | "selected";

type TableRowProps = HTMLAttributes<HTMLDivElement> & {
  selected?: boolean;
};

export function TableRow({
  selected = false,
  className,
  children,
  ...props
}: TableRowProps) {
  return (
    // biome-ignore lint/a11y/useFocusableInteractive: Flex table rows are selected by pointer at the DataTable layer.
    // biome-ignore lint/a11y/useSemanticElements: Flex layout is required for the design-system table primitive.
    <div
      className={cn(
        "flex items-center gap-base border-border border-b bg-surface px-lg py-base",
        "last:border-b-0",
        "transition-colors",
        "hover:bg-hover",
        "data-[selected]:bg-selected data-[selected]:hover:bg-selected",
        className,
      )}
      data-selected={selected || undefined}
      role="row"
      {...props}
    >
      {children}
    </div>
  );
}

type TableCellProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function TableCell({ className, children, ...props }: TableCellProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: Flex layout is required for the design-system table primitive.
    <div
      className={cn(
        "flex items-center text-14 text-foreground leading-120",
        className,
      )}
      role="cell"
      {...props}
    >
      {children}
    </div>
  );
}

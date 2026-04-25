"use client";

import type { ReactNode } from "react";
import { ListHeader } from "@/components/patterns/list-header";
import { TableHead, TableHeader } from "@/components/ui/table-header";
import { TableCell, TableRow } from "@/components/ui/table-row";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
};

export type DataTableFilter = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  trigger?: ReactNode;
};

type DataTableProps<T> = {
  rowCount: number;
  countLabel?: (count: number) => ReactNode;
  filters?: ReactNode;
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  selectedRowId?: string;
  onRowClick?: (row: T) => void;
  className?: string;
  emptyState?: ReactNode;
};

export function DataTable<T>({
  rowCount,
  countLabel,
  filters,
  columns,
  rows,
  getRowId,
  selectedRowId,
  onRowClick,
  className,
  emptyState,
}: DataTableProps<T>) {
  return (
    <div className={cn("flex flex-col gap-base", className)}>
      {(filters || countLabel) && (
        <ListHeader
          actions={filters}
          className="pl-md"
          title={countLabel ? countLabel(rowCount) : `${rowCount} rows`}
        />
      )}
      <div className="overflow-hidden rounded-md border border-border">
        <TableHeader>
          {columns.map((col) => (
            <TableHead className={col.className} key={col.id}>
              {col.header}
            </TableHead>
          ))}
        </TableHeader>
        {rows.length === 0 && emptyState ? (
          <div className="bg-surface p-lg text-center text-14 text-foreground-muted">
            {emptyState}
          </div>
        ) : (
          rows.map((row) => {
            const id = getRowId(row);
            const selected = selectedRowId === id;
            const clickable = Boolean(onRowClick);
            return (
              <TableRow
                className={clickable ? "cursor-pointer" : undefined}
                key={id}
                onClick={clickable ? () => onRowClick?.(row) : undefined}
                selected={selected}
              >
                {columns.map((col) => (
                  <TableCell className={col.className} key={col.id}>
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        )}
      </div>
    </div>
  );
}

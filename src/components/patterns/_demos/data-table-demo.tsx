"use client";

import { useState } from "react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/patterns/data-table";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownOption } from "@/components/ui/dropdown-option";
import { DropdownTrigger } from "@/components/ui/dropdown-trigger";
import { Icon } from "@/components/ui/icon";
import { LabelSmall } from "@/components/ui/label-small";

type Call = {
  id: string;
  date: string;
  agent: string;
  duration: string;
  address: string;
  status: "pass" | "fail";
};

const rows: Call[] = [
  {
    id: "1",
    date: "22nd April 2026",
    agent: "Property Management",
    duration: "1:28",
    address: "59 Wakefield Rd",
    status: "fail",
  },
  {
    id: "2",
    date: "22nd April 2026",
    agent: "Property Management",
    duration: "1:28",
    address: "59 Wakefield Rd",
    status: "pass",
  },
  {
    id: "3",
    date: "22nd April 2026",
    agent: "Property Management",
    duration: "1:28",
    address: "59 Wakefield Rd",
    status: "pass",
  },
  {
    id: "4",
    date: "22nd April 2026",
    agent: "Property Management",
    duration: "1:28",
    address: "59 Wakefield Rd",
    status: "pass",
  },
  {
    id: "5",
    date: "22nd April 2026",
    agent: "Property Management",
    duration: "1:28",
    address: "59 Wakefield Rd",
    status: "pass",
  },
];

const columns: DataTableColumn<Call>[] = [
  { id: "date", header: "Date", cell: (r) => r.date, className: "w-40" },
  { id: "agent", header: "Agent", cell: (r) => r.agent, className: "w-48" },
  {
    id: "duration",
    header: "Duration",
    cell: (r) => r.duration,
    className: "w-24",
  },
  {
    id: "address",
    header: "Address",
    cell: (r) => r.address,
    className: "w-48",
  },
  {
    id: "status",
    header: "Pass / Fail",
    className: "flex-1",
    cell: (r) =>
      r.status === "pass" ? (
        <LabelSmall variant="success">Pass</LabelSmall>
      ) : (
        <LabelSmall variant="destructive">Failed</LabelSmall>
      ),
  },
];

export function DataTableDemo() {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  return (
    <DataTable
      columns={columns}
      countLabel={(c) => `${c} Calls`}
      filters={
        <>
          <DropdownMenu
            trigger={
              <DropdownTrigger leadingIcon={<Icon name="filter" size="sm" />}>
                Filter
              </DropdownTrigger>
            }
          >
            <DropdownOption>Pass</DropdownOption>
            <DropdownOption>Failed</DropdownOption>
          </DropdownMenu>
          <DropdownMenu
            trigger={
              <DropdownTrigger leadingIcon={<Icon name="calendar" size="sm" />}>
                All time
              </DropdownTrigger>
            }
          >
            <DropdownOption selected>All time</DropdownOption>
            <DropdownOption>This week</DropdownOption>
            <DropdownOption>Today</DropdownOption>
          </DropdownMenu>
        </>
      }
      getRowId={(r) => r.id}
      onRowClick={(r) => setSelectedId(r.id === selectedId ? undefined : r.id)}
      rowCount={rows.length}
      rows={rows}
      selectedRowId={selectedId}
    />
  );
}

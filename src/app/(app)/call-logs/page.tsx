"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { type Call, calls, getCallById } from "@/app/(app)/_mock-data";
import { PageContent } from "@/components/patterns/app-shell";
import { CallDetailSidePanel } from "@/components/patterns/call-detail-side-panel";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/patterns/data-table";
import { PageHeaderList } from "@/components/patterns/page-header-list";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownOption } from "@/components/ui/dropdown-option";
import { DropdownTrigger } from "@/components/ui/dropdown-trigger";
import { Icon } from "@/components/ui/icon";
import { LabelSmall } from "@/components/ui/label-small";

const columns: DataTableColumn<Call>[] = [
  { id: "date", header: "Date", cell: (row) => row.date, className: "flex-1" },
  {
    id: "agent",
    header: "Agent",
    cell: (row) => row.agent,
    className: "flex-1",
  },
  {
    id: "duration",
    header: "Duration",
    cell: (row) => row.duration,
    className: "flex-1",
  },
  {
    id: "address",
    header: "Address",
    cell: (row) => row.address,
    className: "flex-1",
  },
  {
    id: "status",
    header: "Pass / Fail",
    className: "w-status-column",
    cell: (row) =>
      row.status === "pass" ? (
        <LabelSmall variant="success">Pass</LabelSmall>
      ) : (
        <LabelSmall variant="destructive">Failed</LabelSmall>
      ),
  },
];

export default function CallLogsPage() {
  const router = useRouter();
  const [selectedCallId, setSelectedCallId] = useState<string | undefined>(
    undefined,
  );
  const [query, setQuery] = useState("");

  const filteredCalls = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return calls;
    return calls.filter(
      (c) =>
        c.address.toLowerCase().includes(q) ||
        c.agent.toLowerCase().includes(q) ||
        c.date.toLowerCase().includes(q),
    );
  }, [query]);

  const selectedCall = selectedCallId ? getCallById(selectedCallId) : undefined;

  return (
    <PageContent
      header={
        <PageHeaderList
          onSearchChange={setQuery}
          searchPlaceholder="Search calls"
          searchValue={query}
          title="Call Logs"
          titleIcon={<Icon name="call-incoming" size="md" />}
        />
      }
    >
      <div className="min-h-0 flex-1 overflow-y-auto">
        <DataTable
          columns={columns}
          countLabel={(c) => `${c} Calls`}
          filters={
            <>
              <DropdownMenu
                trigger={
                  <DropdownTrigger
                    leadingIcon={<Icon name="filter" size="sm" />}
                  >
                    Filter
                  </DropdownTrigger>
                }
              >
                <DropdownOption>Pass</DropdownOption>
                <DropdownOption>Failed</DropdownOption>
              </DropdownMenu>
              <DropdownMenu
                trigger={
                  <DropdownTrigger
                    leadingIcon={<Icon name="calendar" size="sm" />}
                  >
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
          getRowId={(row) => row.id}
          onRowClick={(row) =>
            setSelectedCallId((curr) => (curr === row.id ? undefined : row.id))
          }
          rowCount={filteredCalls.length}
          rows={filteredCalls}
          selectedRowId={selectedCallId}
        />
      </div>
      <CallDetailSidePanel
        onClose={() => setSelectedCallId(undefined)}
        onViewIssue={
          selectedCall?.issueId
            ? () => router.push(`/open-issues/${selectedCall.issueId}`)
            : undefined
        }
        open={Boolean(selectedCall)}
        summary={selectedCall?.summary}
        title={selectedCall?.address ?? ""}
        transcript={selectedCall?.transcript}
      />
    </PageContent>
  );
}

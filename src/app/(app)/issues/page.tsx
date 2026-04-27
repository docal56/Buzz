"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PageContent } from "@/components/patterns/app-shell";
import {
  KanbanBoard,
  type KanbanCardData,
  type KanbanColumnDef,
} from "@/components/patterns/kanban-board";
import { PageHeaderList } from "@/components/patterns/page-header-list";
import { SearchHeader } from "@/components/patterns/search-header";
import { Icon } from "@/components/ui/icon";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";

type IssueStatus = Doc<"issues">["status"];
type IssueListItem = Doc<"issues"> & { publicId: string };

const issueStatusColumns: Array<{
  id: IssueStatus;
  title: string;
  defaultCollapsed?: boolean;
}> = [
  { id: "new", title: "New Issues" },
  { id: "in-progress", title: "In Progress" },
  { id: "contractor-scheduled", title: "Contractor Scheduled" },
  { id: "awaiting-follow-up", title: "Awaiting Follow-up" },
  { id: "closed", title: "Closed", defaultCollapsed: true },
];

function issueToCard(issue: IssueListItem): KanbanCardData {
  return {
    id: issue._id,
    columnId: issue.status,
    title: issue.address ?? "No address",
    description: issue.summary,
    timestamp: new Date(issue._creationTime).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  };
}

export default function OpenIssuesPage() {
  const router = useRouter();
  const groupedIssues = useQuery(api.issues.listByStatus, {
    limitPerStatus: 100,
  });
  const updateStatus = useMutation(api.issues.updateStatus);
  const [collapsedColumns, setCollapsedColumns] = useState<
    Record<IssueStatus, boolean>
  >(() => {
    const initial = {} as Record<IssueStatus, boolean>;
    for (const col of issueStatusColumns) {
      initial[col.id] = col.defaultCollapsed ?? false;
    }
    return initial;
  });
  const [query, setQuery] = useState("");

  const issues = useMemo(() => {
    if (!groupedIssues) return [];
    return issueStatusColumns.flatMap((column) => groupedIssues[column.id]);
  }, [groupedIssues]);

  const columns: KanbanColumnDef[] = useMemo(
    () =>
      issueStatusColumns.map((col) => ({
        id: col.id,
        title: col.title,
        collapsed: collapsedColumns[col.id],
      })),
    [collapsedColumns],
  );

  const filteredIssues = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return issues;
    return issues.filter(
      (issue) =>
        (issue.address ?? "").toLowerCase().includes(q) ||
        issue.summary.toLowerCase().includes(q),
    );
  }, [issues, query]);

  const cards = filteredIssues.map(issueToCard);

  const issueById = useMemo(() => {
    const map = new Map<Id<"issues">, IssueListItem>();
    for (const issue of issues) map.set(issue._id, issue);
    return map;
  }, [issues]);

  return (
    <PageContent
      header={
        <PageHeaderList
          onSearchChange={setQuery}
          searchPlaceholder="Search issues"
          searchValue={query}
          title="Open Issues"
          titleIcon={<Icon name="issues" size="md" />}
        />
      }
    >
      {query.trim() ? (
        <SearchHeader onClear={() => setQuery("")} query={query.trim()} />
      ) : null}
      <KanbanBoard
        cards={cards}
        className="min-h-0 flex-1"
        columns={columns}
        onCardClick={(cardId) => {
          const issue = issueById.get(cardId as Id<"issues">);
          if (issue) router.push(`/issues/${issue.publicId}`);
        }}
        onCardMove={(cardId, toColumnId) =>
          void updateStatus({
            id: cardId as Id<"issues">,
            status: toColumnId as IssueStatus,
          })
        }
        onColumnCollapseChange={(columnId, collapsed) =>
          setCollapsedColumns((curr) => ({
            ...curr,
            [columnId as IssueStatus]: collapsed,
          }))
        }
      />
    </PageContent>
  );
}

"use client";

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
import { Label } from "@/components/ui/label";
import {
  type Issue,
  type IssueStatus,
  issueStatusColumns,
  issues as seedIssues,
} from "../_mock-data";

function issueToCard(issue: Issue): KanbanCardData {
  return {
    id: issue.publicId,
    columnId: issue.status,
    title: issue.address,
    description: issue.description,
    timestamp: issue.reportedAt,
    badge: issue.urgent ? (
      <Label variant="destructive">Urgent</Label>
    ) : undefined,
  };
}

export default function OpenIssuesPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>(seedIssues);
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
        issue.address.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q),
    );
  }, [issues, query]);

  const cards = filteredIssues.map(issueToCard);

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
        onCardClick={(cardId) => router.push(`/issues/${cardId}`)}
        onCardMove={(cardId, toColumnId) =>
          setIssues((curr) =>
            curr.map((issue) =>
              issue.publicId === cardId
                ? { ...issue, status: toColumnId as IssueStatus }
                : issue,
            ),
          )
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

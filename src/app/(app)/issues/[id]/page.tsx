"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";
import { PageContent } from "@/components/patterns/app-shell";
import { PageHeaderDetail } from "@/components/patterns/page-header-detail";
import { SidebarPanel } from "@/components/patterns/sidebar-panel";
import { TabbedContent } from "@/components/patterns/tabbed-content";
import {
  type TimelineItem as PatternTimelineItem,
  TimelineView,
} from "@/components/patterns/timeline-view";
import { TranscriptView } from "@/components/patterns/transcript-view";
import { UpdateComposer } from "@/components/patterns/update-composer";
import { Icon } from "@/components/ui/icon";
import { Inline } from "@/components/ui/inline";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

type IssueStatus = Doc<"issues">["status"];
type IssueListItem = Doc<"issues"> & { publicId: string };
type IssueUpdate = Doc<"issueUpdates">;

const statusOrder: IssueStatus[] = [
  "new",
  "in-progress",
  "contractor-scheduled",
  "awaiting-follow-up",
  "closed",
];

function formatDate(value: number): string {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDuration(seconds: number | null): string | undefined {
  if (seconds === null) return undefined;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

function statusLabel(status: IssueStatus): string {
  switch (status) {
    case "new":
      return "New Issue";
    case "in-progress":
      return "In Progress";
    case "contractor-scheduled":
      return "Contractor Scheduled";
    case "awaiting-follow-up":
      return "Awaiting Follow-up";
    case "closed":
      return "Closed";
  }
}

function statusIcon(status: IssueStatus) {
  const name =
    status === "new"
      ? "status-new"
      : status === "in-progress"
        ? "status-in-progress"
        : status === "contractor-scheduled"
          ? "calendar"
          : status === "awaiting-follow-up"
            ? "status-waiting"
            : "completed";
  return <Icon name={name} size="md" />;
}

function toPatternTimelineItem(item: IssueUpdate): PatternTimelineItem {
  if (item.kind === "comment") {
    return {
      id: item._id,
      variant: "avatar-led",
      authorName: "Team update",
      authorAlt: "Team update",
      timestamp: formatDate(item._creationTime),
      body: item.body ?? "",
    };
  }

  const status = (item.metadata as { to?: IssueStatus } | undefined)?.to;
  const isCreated = item.kind === "created_from_call";
  return {
    id: item._id,
    variant: "icon-led",
    title: isCreated
      ? "Tenant reported issue"
      : `Status changed to ${status ? statusLabel(status) : "new status"}`,
    timestamp: formatDate(item._creationTime),
    tone: isCreated ? "purple" : "orange",
    icon: <Icon name={isCreated ? "phone" : "status-in-progress"} size="sm" />,
  };
}

function flattenIssues(
  grouped: Record<IssueStatus, IssueListItem[]> | undefined,
): IssueListItem[] {
  if (!grouped) return [];
  return statusOrder.flatMap((status) => grouped[status]);
}

export default function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const issue = useQuery(api.issues.getByPublicId, { publicId: id });
  const groupedIssues = useQuery(api.issues.listByStatus, {
    limitPerStatus: 100,
  });
  const addComment = useMutation(api.issueUpdates.addComment);
  const [update, setUpdate] = useState("");

  const adjacent = useMemo(() => {
    const allIssues = flattenIssues(groupedIssues);
    const index = allIssues.findIndex((candidate) => candidate.publicId === id);
    if (index < 0) return {};
    return {
      prev: index > 0 ? allIssues[index - 1]?.publicId : undefined,
      next:
        index < allIssues.length - 1
          ? allIssues[index + 1]?.publicId
          : undefined,
    };
  }, [groupedIssues, id]);

  const sendUpdate = async () => {
    if (!issue) return;
    const body = update.trim();
    if (!body) return;
    await addComment({ issueId: issue._id, body });
    setUpdate("");
  };

  if (issue === undefined) {
    return (
      <PageContent
        header={
          <PageHeaderDetail
            current="Loading"
            onBack={() => router.push("/issues")}
            parent="Issues"
          />
        }
      >
        <div className="flex min-h-0 flex-1 items-center justify-center p-2xl text-14 text-foreground-muted">
          Loading issue...
        </div>
      </PageContent>
    );
  }

  if (issue === null) {
    return (
      <PageContent
        header={
          <PageHeaderDetail
            current="Not found"
            onBack={() => router.push("/issues")}
            parent="Issues"
          />
        }
      >
        <div className="flex min-h-0 flex-1 items-center justify-center p-2xl text-14 text-foreground-muted">
          Issue not found.
        </div>
      </PageContent>
    );
  }

  const timelineItems = issue.timeline.map(toPatternTimelineItem);
  const transcript =
    issue.primaryConversation?.messages?.map((message, index) => ({
      id: `${issue.primaryConversationId}:${index}`,
      variant:
        message.role === "agent"
          ? ("incoming" as const)
          : ("outgoing" as const),
      body: message.body,
    })) ?? [];
  const callDuration = formatDuration(
    issue.primaryConversation?.callDurationSecs ?? null,
  );

  const detailsContent = (
    <div className="flex flex-col gap-xl">
      <p className="text-14 text-foreground leading-160">{issue.summary}</p>
      <TimelineView items={timelineItems} />
    </div>
  );

  const transcriptContent = (
    <TranscriptView callDuration={callDuration} messages={transcript} />
  );

  return (
    <PageContent
      header={
        <PageHeaderDetail
          current={issue.address ?? "No address"}
          onBack={() => router.push("/issues")}
          onNext={
            adjacent.next
              ? () => router.push(`/issues/${adjacent.next}`)
              : undefined
          }
          onPrev={
            adjacent.prev
              ? () => router.push(`/issues/${adjacent.prev}`)
              : undefined
          }
          parent="Issues"
        />
      }
      variant="detail"
    >
      <div className="flex min-h-0 flex-1 gap-md overflow-hidden pr-md">
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-lg border-border border-x border-t bg-surface pt-xl pb-lg">
          <div className="min-h-0 flex-1 overflow-y-auto px-lg">
            <div className="mx-auto w-full max-w-content">
              <TabbedContent
                className="gap-xl"
                tabs={[
                  {
                    value: "details",
                    label: "Details",
                    content: detailsContent,
                  },
                  {
                    value: "transcript",
                    label: "Call Transcript",
                    content: transcriptContent,
                  },
                ]}
              />
            </div>
          </div>
          <div className="shrink-0 px-lg pt-xl">
            <div className="mx-auto w-full max-w-content">
              <UpdateComposer
                onAddMedia={() => {}}
                onSend={() => {
                  void sendUpdate();
                }}
                onValueChange={setUpdate}
                value={update}
              />
            </div>
          </div>
        </section>
        <aside className="shrink-0 overflow-y-auto">
          <SidebarPanel
            cards={[
              {
                id: "status",
                title: "Status",
                rows: [
                  {
                    id: "current-status",
                    label: (
                      <Inline icon={statusIcon(issue.status)}>
                        {statusLabel(issue.status)}
                      </Inline>
                    ),
                  },
                  {
                    id: "add-contractor",
                    label: (
                      <Inline icon={<Icon name="contact" size="md" />}>
                        Add contractor
                      </Inline>
                    ),
                    state: "placeholder",
                  },
                  {
                    id: "add-scheduled",
                    label: (
                      <Inline icon={<Icon name="calendar" size="md" />}>
                        Add date work scheduled for
                      </Inline>
                    ),
                    state: "placeholder",
                  },
                ],
              },
              {
                id: "details",
                title: "Details",
                rows: [
                  {
                    id: "address",
                    label: (
                      <Inline icon={<Icon name="home" size="md" />}>
                        {issue.address ?? "No address"}
                      </Inline>
                    ),
                  },
                  {
                    id: "name",
                    label: (
                      <Inline icon={<Icon name="user" size="md" />}>
                        {issue.contactName ?? "No contact name"}
                      </Inline>
                    ),
                  },
                  {
                    id: "phone",
                    label: (
                      <Inline icon={<Icon name="phone" size="md" />}>
                        {issue.contactPhone ?? "No phone number"}
                      </Inline>
                    ),
                  },
                  {
                    id: "email",
                    label: (
                      <Inline icon={<Icon name="email" size="md" />}>
                        {issue.contactEmail ?? "No email"}
                      </Inline>
                    ),
                  },
                ],
              },
            ]}
          />
        </aside>
      </div>
    </PageContent>
  );
}

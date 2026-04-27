"use client";

import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";
import {
  getAdjacentIssueIds,
  getIssueByPublicId,
  type Issue,
  type TimelineItem as MockTimelineItem,
} from "@/app/(app)/_mock-data";
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

function toPatternTimelineItem(item: MockTimelineItem): PatternTimelineItem {
  if (item.variant === "avatar-led") {
    return {
      id: item.id,
      variant: "avatar-led",
      authorName: item.authorName,
      authorAlt: item.authorAlt,
      authorImageSrc: item.authorImageSrc,
      timestamp: item.timestamp,
      body: item.body,
    };
  }
  return {
    id: item.id,
    variant: "icon-led",
    title: item.title,
    timestamp: item.timestamp,
    tone: item.tone,
    icon: <Icon name={item.iconName} size="sm" />,
  };
}

function statusLabel(status: Issue["status"]): string {
  switch (status) {
    case "new":
      return "New Issue";
    case "in-progress":
      return "In Progress";
    case "contractor-scheduled":
      return "Contractor Scheduled";
    case "completed":
      return "Completed";
  }
}

function statusIcon(status: Issue["status"]) {
  const name =
    status === "new"
      ? "status-new"
      : status === "in-progress"
        ? "status-in-progress"
        : status === "contractor-scheduled"
          ? "calendar"
          : "completed";
  return <Icon name={name} size="md" />;
}

export default function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const issue = getIssueByPublicId(id);
  const [update, setUpdate] = useState("");

  const adjacent = useMemo(() => getAdjacentIssueIds(id), [id]);

  if (!issue) {
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

  const detailsContent = (
    <div className="flex flex-col gap-xl">
      <p className="text-14 text-foreground leading-160">{issue.description}</p>
      <TimelineView items={timelineItems} />
    </div>
  );

  const transcriptContent = (
    <TranscriptView
      callDuration={issue.callDuration}
      messages={issue.transcript}
    />
  );

  return (
    <PageContent
      header={
        <PageHeaderDetail
          current={issue.address}
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
                onSend={() => setUpdate("")}
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
                        {issue.contact.fullAddress}
                      </Inline>
                    ),
                  },
                  {
                    id: "name",
                    label: (
                      <Inline icon={<Icon name="user" size="md" />}>
                        {issue.contact.name}
                      </Inline>
                    ),
                  },
                  {
                    id: "phone",
                    label: (
                      <Inline icon={<Icon name="phone" size="md" />}>
                        {issue.contact.phone}
                      </Inline>
                    ),
                  },
                  {
                    id: "email",
                    label: (
                      <Inline icon={<Icon name="email" size="md" />}>
                        {issue.contact.email}
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

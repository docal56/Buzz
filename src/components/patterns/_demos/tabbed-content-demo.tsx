"use client";

import { TabbedContent } from "@/components/patterns/tabbed-content";

export function TabbedContentDemo() {
  return (
    <div className="overflow-hidden rounded-md border border-border p-lg">
      <TabbedContent
        tabs={[
          {
            value: "details",
            label: "Details",
            content: (
              <p className="p-md text-14 text-foreground leading-160">
                Tenant reported a broken hot tap. The issue started on weds 16th
                April, but hot water is available elsewhere in the property.
              </p>
            ),
          },
          {
            value: "transcript",
            label: "Call Transcript",
            content: (
              <p className="p-md text-14 text-foreground-muted leading-160">
                Full call transcript goes here.
              </p>
            ),
          },
        ]}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { CallDetailSidePanel } from "@/components/patterns/call-detail-side-panel";
import { Button } from "@/components/ui/button";

export function CallDetailSidePanelDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-md">
      <Button onClick={() => setOpen(true)}>Open side panel</Button>
      <p className="text-12 text-foreground-subtle">
        The panel docks to the right edge of the viewport. Press Escape or click
        the × to close. The rest of the page stays interactive while it&apos;s
        open.
      </p>
      <CallDetailSidePanel
        onClose={() => setOpen(false)}
        onViewIssue={() => {}}
        open={open}
        summary="Tenant reported a broken hot tap. The issue started on weds 16th April, but hot water is available elsewhere in the property."
        title="59 Wakefield Road"
        transcript={[
          {
            id: "1",
            variant: "incoming",
            body: "Hi, Relocate Property management how can I help you?",
          },
          {
            id: "2",
            variant: "outgoing",
            body: "Oh, hi. Yeah, I'd like to report, um, a rat in my kitchen.",
          },
        ]}
      />
    </div>
  );
}

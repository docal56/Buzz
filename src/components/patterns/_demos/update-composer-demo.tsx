"use client";

import { useState } from "react";
import { UpdateComposer } from "@/components/patterns/update-composer";

export function UpdateComposerDemo() {
  const [value, setValue] = useState("");
  const [sentCount, setSentCount] = useState(0);

  return (
    <div className="flex flex-col gap-md">
      <UpdateComposer
        onAddMedia={() => {}}
        onSend={() => {
          if (!value.trim()) return;
          setSentCount((c) => c + 1);
          setValue("");
        }}
        onValueChange={setValue}
        value={value}
      />
      {sentCount > 0 ? (
        <p className="text-12 text-foreground-subtle">
          {sentCount} update{sentCount === 1 ? "" : "s"} sent in this demo.
        </p>
      ) : null}
    </div>
  );
}

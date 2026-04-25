"use client";

import { useState } from "react";
import { SearchHeader } from "@/components/patterns/search-header";

export function SearchHeaderDemo() {
  const [query, setQuery] = useState("Elm Court");

  return (
    <div className="flex flex-col gap-md">
      {query ? (
        <SearchHeader onClear={() => setQuery("")} query={query} />
      ) : (
        <p className="rounded-md border border-border border-dashed p-lg text-12 text-foreground-subtle">
          Cleared — the header hides when there&apos;s no active query.
        </p>
      )}
      <button
        className="w-fit text-12 text-foreground-subtle underline"
        onClick={() => setQuery("Elm Court")}
        type="button"
      >
        Reset demo
      </button>
    </div>
  );
}

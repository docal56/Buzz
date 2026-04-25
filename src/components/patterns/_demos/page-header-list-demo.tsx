"use client";

import { useState } from "react";
import { PageHeaderList } from "@/components/patterns/page-header-list";
import { Icon } from "@/components/ui/icon";

export function PageHeaderListDemo() {
  const [search, setSearch] = useState("");

  return (
    <PageHeaderList
      onSearchChange={setSearch}
      searchPlaceholder="Search issues"
      searchValue={search}
      title="Open Issues"
      titleIcon={<Icon name="issues" size="md" />}
    />
  );
}

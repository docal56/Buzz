"use client";

import { PageHeaderDetail } from "@/components/patterns/page-header-detail";

export function PageHeaderDetailDemo() {
  return (
    <PageHeaderDetail
      current="59 Wakefield Road, HX3 8AQ"
      onBack={() => {}}
      onNext={() => {}}
      onPrev={() => {}}
      parent="Open Issues"
    />
  );
}

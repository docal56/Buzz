"use client";

import type { ReactNode } from "react";
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type TabbedContentTab = {
  value: string;
  label: ReactNode;
  content: ReactNode;
};

type TabbedContentProps = {
  tabs: TabbedContentTab[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

export function TabbedContent({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className,
}: TabbedContentProps) {
  return (
    <Tabs
      className={cn(className)}
      defaultValue={defaultValue ?? tabs[0]?.value}
      onValueChange={onValueChange}
      value={value}
    >
      <TabList>
        {tabs.map((tab) => (
          <Tab className="first:pl-0" key={tab.value} value={tab.value}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.value} value={tab.value}>
          {tab.content}
        </TabPanel>
      ))}
    </Tabs>
  );
}

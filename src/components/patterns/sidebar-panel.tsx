import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { DetailRow, type DetailRowState } from "@/components/ui/detail-row";
import { SidePanelNarrow } from "@/components/ui/side-panel";
import { cn } from "@/lib/utils";

export type SidebarPanelRow = {
  id: string;
  icon?: ReactNode;
  label: ReactNode;
  state?: DetailRowState;
};

export type SidebarPanelCard = {
  id: string;
  title: ReactNode;
  rows: SidebarPanelRow[];
};

type SidebarPanelProps = {
  cards: SidebarPanelCard[];
  className?: string;
};

export function SidebarPanel({ cards, className }: SidebarPanelProps) {
  return (
    <SidePanelNarrow className={cn("gap-base", className)}>
      {cards.map((card) => (
        <Card className="gap-lg" header={card.title} key={card.id}>
          <div className="flex flex-col">
            {card.rows.map((row) => (
              <DetailRow icon={row.icon} key={row.id} state={row.state}>
                {row.label}
              </DetailRow>
            ))}
          </div>
        </Card>
      ))}
    </SidePanelNarrow>
  );
}

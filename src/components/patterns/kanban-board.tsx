"use client";

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { ReactNode, Ref } from "react";
import { useRef, useState } from "react";
import { BoardCard } from "@/components/ui/board-card";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const DROP_PLACEHOLDER_FALLBACK_HEIGHT = 158;

export type KanbanColumnState =
  | "withItems"
  | "empty"
  | "dragCard"
  | "collapsed";

type KanbanColumnProps = {
  title: ReactNode;
  count?: number;
  state?: KanbanColumnState;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  children?: ReactNode;
  className?: string;
  innerRef?: Ref<HTMLDivElement>;
  showDropPlaceholder?: boolean;
  dropPlaceholderHeight?: number;
};

export function KanbanColumn({
  title,
  count,
  state = "withItems",
  collapsed,
  onCollapseChange,
  children,
  className,
  innerRef,
  showDropPlaceholder = false,
  dropPlaceholderHeight,
}: KanbanColumnProps) {
  const isCollapsed = state === "collapsed" || collapsed;
  return (
    <div
      className={cn(
        "flex w-kanban-column shrink-0 flex-col gap-lg rounded-t-lg bg-neutral-200 px-md pt-md",
        className,
      )}
      ref={innerRef}
    >
      <div className="flex items-center gap-md px-md font-medium text-14 text-foreground">
        <span className="flex-1 truncate">{title}</span>
        {isCollapsed ? (
          <Toggle
            aria-label="Expand column"
            checked={!collapsed}
            onCheckedChange={(v) => onCollapseChange?.(!v)}
          />
        ) : count !== undefined ? (
          <span className="text-14 text-foreground">{count}</span>
        ) : null}
      </div>
      {!isCollapsed ? (
        <div className="flex flex-col gap-md">
          {children}
          {showDropPlaceholder ? (
            <div
              aria-hidden
              className="w-full rounded-md bg-hover"
              style={{
                height:
                  dropPlaceholderHeight ?? DROP_PLACEHOLDER_FALLBACK_HEIGHT,
              }}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export type KanbanCardData = {
  id: string;
  columnId: string;
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  badge?: ReactNode;
};

export type KanbanColumnDef = {
  id: string;
  title: ReactNode;
  collapsed?: boolean;
};

type KanbanBoardProps = {
  columns: KanbanColumnDef[];
  cards: KanbanCardData[];
  onCardMove?: (cardId: string, toColumnId: string) => void;
  onCardClick?: (cardId: string) => void;
  onColumnCollapseChange?: (columnId: string, collapsed: boolean) => void;
  className?: string;
};

function DroppableKanbanColumn({
  id,
  collapsed,
  children,
  dropPlaceholderHeight,
  ...rest
}: {
  id: string;
  title: ReactNode;
  count?: number;
  collapsed?: boolean;
  onCollapseChange?: (c: boolean) => void;
  children?: ReactNode;
  dropPlaceholderHeight?: number;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const state: KanbanColumnState = collapsed
    ? "collapsed"
    : isOver
      ? "dragCard"
      : "withItems";
  return (
    <KanbanColumn
      collapsed={collapsed}
      dropPlaceholderHeight={dropPlaceholderHeight}
      innerRef={setNodeRef}
      showDropPlaceholder={isOver && !collapsed}
      state={state}
      {...rest}
    >
      {children}
    </KanbanColumn>
  );
}

function DraggableCard({
  card,
  onCardClick,
  onMeasure,
}: {
  card: KanbanCardData;
  onCardClick?: (id: string) => void;
  onMeasure?: (id: string, height: number) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
  });
  const measureRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    if (node && onMeasure) onMeasure(card.id, node.offsetHeight);
  };
  return (
    <div
      className={cn("touch-none", isDragging && "opacity-0")}
      ref={measureRef}
      {...listeners}
      {...attributes}
    >
      <BoardCard
        badge={card.badge}
        description={card.description}
        onClick={onCardClick ? () => onCardClick(card.id) : undefined}
        timestamp={card.timestamp}
        title={card.title}
      />
    </div>
  );
}

export function KanbanBoard({
  columns,
  cards,
  onCardMove,
  onCardClick,
  onColumnCollapseChange,
  className,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const cardHeights = useRef(new Map<string, number>());
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const handleMeasure = (id: string, height: number) => {
    cardHeights.current.set(id, height);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    if (!event.over) return;
    const cardId = String(event.active.id);
    const toColumnId = String(event.over.id);
    const card = cards.find((c) => c.id === cardId);
    if (card && card.columnId !== toColumnId) onCardMove?.(cardId, toColumnId);
  };

  const activeCard = activeId ? cards.find((c) => c.id === activeId) : null;
  const activeCardHeight = activeId
    ? cardHeights.current.get(activeId)
    : undefined;

  return (
    <DndContext
      id="open-issues-kanban"
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <div
        className={cn(
          "flex min-w-0 justify-start gap-lg overflow-x-auto",
          className,
        )}
      >
        {columns.map((col) => {
          const cardsForColumn = cards.filter((c) => c.columnId === col.id);
          return (
            <DroppableKanbanColumn
              collapsed={col.collapsed}
              count={col.collapsed ? undefined : cardsForColumn.length}
              dropPlaceholderHeight={activeCardHeight}
              id={col.id}
              key={col.id}
              onCollapseChange={
                onColumnCollapseChange
                  ? (c) => onColumnCollapseChange(col.id, c)
                  : undefined
              }
              title={col.title}
            >
              {cardsForColumn.map((card) => (
                <DraggableCard
                  card={card}
                  key={card.id}
                  onCardClick={onCardClick}
                  onMeasure={handleMeasure}
                />
              ))}
            </DroppableKanbanColumn>
          );
        })}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeCard ? (
          <BoardCard
            badge={activeCard.badge}
            className="-rotate-2 shadow-hover"
            description={activeCard.description}
            timestamp={activeCard.timestamp}
            title={activeCard.title}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/**
 * @file dashboard/KanbanCard.tsx
 * @description Client component rendering a single kanban card container with individual loading states and modular sub-components.
 */

"use client";

import { Loader2 } from "lucide-react";
import { KanbanCardProps, TaskStatus } from "@/types/tasks";
import KanbanCardActions from "./components/KanbanCardActions";
import KanbanCardAvatars from "./components/KanbanCardAvatars";
import KanbanCardDueDate from "./components/KanbanCardDueDate";
import KanbanCardPriority from "./components/KanbanCardPriority";

/**
 * Renders an interactive kanban card container handling drag-and-drop actions, loading states,
 * and assembling modular sub-components for priorities, due dates, avatars, and actions.
 *
 * @param {KanbanCardProps} props - The component props containing the task object, updating status flag, and status change handler.
 * @returns {JSX.Element} The rendered kanban card component.
 */
export default function KanbanCard({
  task,
  isUpdating = false,
  onStatusChange,
}: KanbanCardProps) {
  /**
   * Initiates the drag action on a task card if not currently updating, storing its ID and status payload.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event object.
   */
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isUpdating) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.setData("sourceStatus", task.status);
    e.dataTransfer.effectAllowed = "move";
  };

  /**
   * Triggers the status change callback with the target task ID and new status if updates are permitted.
   *
   * @param {TaskStatus} newStatus - The target task status to transition to.
   */
  const handleMove = (newStatus: TaskStatus) => {
    if (!onStatusChange || isUpdating) return;
    onStatusChange(task.id, newStatus);
  };

  return (
    <div
      draggable={!isUpdating}
      onDragStart={handleDragStart}
      className={`group relative bg-card/40 border border-border/80 hover:border-primary/60 p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 space-y-3 flex flex-col h-full ${
        isUpdating
          ? "opacity-50 pointer-events-none cursor-wait bg-primary/5 border-primary/40 animate-pulse"
          : "cursor-grab active:cursor-grabbing hover:-translate-y-0.5"
      }`}
    >
      {/* Loading Spinner */}
      {isUpdating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/25 backdrop-blur-[0.5px] rounded-2xl">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      )}

      {/* --- Card Header --- */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug group-hover/card:text-primary transition-colors line-clamp-2">
          {task.title}
        </h3>
        <KanbanCardPriority priority={task.priority} />
      </div>

      {/* Card Description */}
      <p className="text-sm leading-relaxed text-foreground-muted line-clamp-3">
        {task.description}
      </p>

      {/* --- Card Footer --- */}
      <div className="flex items-center justify-between pt-3 mt-auto text-xs border-t border-border">
        <KanbanCardDueDate task={task} />

        <div className="flex items-center gap-2">
          <KanbanCardAvatars
            creator={task.creator}
            assignees={task.assignees}
          />
          <KanbanCardActions currentStatus={task.status} onMove={handleMove} />
        </div>
      </div>
    </div>
  );
}

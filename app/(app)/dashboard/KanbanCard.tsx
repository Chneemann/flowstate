/**
 * @file dashboard/KanbanCard.tsx
 * @description Client component rendering a single kanban card container with native drag-and-drop source handlers and modular sub-components.
 */

"use client";

import { KanbanCardProps, TaskStatus } from "@/types/tasks";
import KanbanCardActions from "./components/KanbanCardActions";
import KanbanCardAvatars from "./components/KanbanCardAvatars";
import KanbanCardDueDate from "./components/KanbanCardDueDate";
import KanbanCardPriority from "./components/KanbanCardPriority";

/**
 * Renders an interactive kanban card container holding title, description,
 * modular priority badges, deadline elements, assignees, and action triggers.
 *
 * @param {KanbanCardProps} props - The component props containing the task object and status change handler.
 * @returns {JSX.Element} The rendered kanban card container component.
 */
export default function KanbanCard({ task, onStatusChange }: KanbanCardProps) {
  /**
   * Initiates the drag action on a task card, storing its ID and current status in the data transfer payload.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event object.
   */
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.setData("sourceStatus", task.status);
    e.dataTransfer.effectAllowed = "move";
  };

  /**
   * Triggers the status change callback with the target task ID and new status.
   *
   * @param {TaskStatus} newStatus - The target task status to transition to.
   */
  const handleMove = (newStatus: TaskStatus) => {
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="group relative bg-card/40 border border-border/80 hover:border-primary/60 p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 space-y-3 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 flex flex-col h-full"
    >
      {/* --- Card Header --- */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug group-hover/card:text-primary transition-colors line-clamp-2">
          {task.title}
        </h3>
        {/* Card Priority */}
        <KanbanCardPriority priority={task.priority} />
      </div>

      {/* Card Description */}
      <p className="text-sm leading-relaxed text-foreground-muted line-clamp-3">
        {task.description}
      </p>

      {/* --- Card Footer --- */}
      <div className="flex items-center justify-between pt-3 mt-auto text-xs border-t border-border">
        {/* Date Badge Component */}
        <KanbanCardDueDate task={task} />

        {/* Avatars & Mobile Switcher */}
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

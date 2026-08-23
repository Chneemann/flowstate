/**
 * @file app/(app)/dashboard/card/Card.tsx
 * @description Client component rendering a single card container with individual loading states and modular sub-components.
 */

"use client";

import { Loader2 } from "lucide-react";
import { Task, TaskStatus } from "@/lib/types/task";
import CardActions from "./CardActions";
import CardAvatars from "./CardAvatars";
import CardDueDate from "./CardDueDate";
import CardPriority from "./CardPriority";
import HighlightText from "@/app/components/ui/HighlightText";
import { useSearchParams } from "next/navigation";

/**
 * Properties for the Card component.
 *
 * @interface CardProps
 * @property {Task} task - The task data object to render.
 * @property {boolean} [isUpdating] - Flag indicating whether the card is currently undergoing an asynchronous update operation.
 * @property {(taskId: string, newStatus: TaskStatus) => void} [onStatusChange] - Callback triggered when the task status changes.
 * @property {(taskId: string) => void} [onDelete] - Callback triggered when the task is deleted.
 */
export interface CardProps {
  task: Task;
  isUpdating?: boolean;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onDelete?: (taskId: string) => void;
}

/**
 * Renders an interactive card container supporting search match highlighting, drag-and-drop actions,
 * loading states, and modular sub-components for priorities, due dates, avatars, and actions.
 *
 * @param {CardProps} props - The component props containing the task object, updating status flag, and status change handler.
 * @returns {JSX.Element} The rendered card component.
 */
export default function Card({
  task,
  isUpdating = false,
  onStatusChange,
  onDelete,
}: CardProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

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
    e.dataTransfer.setData("isCreator", String(task.isCreator ?? false));
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
          <HighlightText text={task.title} query={searchQuery} />
        </h3>
        <CardPriority priority={task.priority} />
      </div>

      {/* Card Description */}
      <p className="text-sm leading-relaxed text-foreground-muted line-clamp-3">
        <HighlightText text={task.description} query={searchQuery} />
      </p>

      {/* --- Card Footer --- */}
      <div className="flex items-center justify-between pt-3 mt-auto text-xs border-t border-border">
        <CardDueDate task={task} />

        <div className="flex items-center gap-2">
          <CardAvatars creator={task.creator} assignees={task.assignees} />
          <CardActions
            taskId={task.id}
            currentStatus={task.status}
            isCreator={task.isCreator ?? false}
            onMove={handleMove}
            onDelete={() => onDelete?.(task.id)}
          />
        </div>
      </div>
    </div>
  );
}

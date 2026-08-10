/**
 * @file dashboard/KanbanColumn.tsx
 * @description Client component rendering a single kanban column container supporting drag-and-drop drop targets and status updates.
 */

"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import KanbanCard from "./KanbanCard";
import { KanbanColumnProps, TaskStatus } from "@/types/tasks";

/**
 * Renders a kanban column with title indicators, task counters, drag-and-drop event handlers,
 * and lists of nested KanbanCard items.
 *
 * @param {KanbanColumnProps} props - The component props including column ID, title, count, tasks, and color configuration.
 * @returns {JSX.Element} The rendered kanban column component.
 */
export default function KanbanColumn(props: KanbanColumnProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const indicatorColor = props.color ?? "bg-primary";

  /**
   * Updates the status of a specific task via a PATCH API request and refreshes the router state.
   *
   * @async
   * @param {string} taskId - The unique identifier of the task to update.
   * @param {TaskStatus} targetStatus - The destination status to apply to the task.
   */
  const updateTaskStatus = (taskId: string, targetStatus: TaskStatus) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: targetStatus }),
        });

        if (!response.ok) {
          throw new Error("Failed to update task status");
        }

        router.refresh();
      } catch (error) {
        console.error("Error during task status update:", error);
      }
    });
  };

  /**
   * Handles the drag-over event to allow dropping items onto the column.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event object.
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDraggingOver(true);
  };

  /**
   * Handles the drag-leave event when a dragged item leaves the column bounds.
   */
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  /**
   * Handles dropping a task card onto the column, triggering status updates if valid.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - The drop event object.
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const taskId = e.dataTransfer.getData("text/plain");
    const sourceStatus = e.dataTransfer.getData("sourceStatus") as TaskStatus;

    if (!taskId || sourceStatus === props.id) return;

    updateTaskStatus(taskId, props.id);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full flex flex-col rounded-2xl p-4 transition-all duration-300 bg-background-muted/40 border ${
        isDraggingOver
          ? "border-primary/80 bg-primary/5 shadow-lg ring-4 ring-primary/10"
          : "border-border/60 shadow-sm"
      } ${isPending ? "opacity-60 pointer-events-none" : ""}`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full shadow-sm ${indicatorColor}`}
          />
          <h2 className="font-bold text-xs uppercase tracking-wider">
            {props.title}
          </h2>
          <span className="text-xs bg-card text-foreground-muted px-2 py-0.5 rounded-full font-semibold border border-border/60">
            {props.count}
          </span>
        </div>
        <button className="text-background hover:text-foreground p-1.5 rounded-lg bg-primary hover:bg-primary-hover transition-all duration-200 cursor-pointer shadow-sm active:scale-95">
          <Plus size={14} />
        </button>
      </div>

      {/* Card List */}
      <div className="flex flex-col gap-3">
        {props.tasks.length === 0 ? (
          <div className="h-28 rounded-xl border border-dashed border-border/80 flex flex-col items-center justify-center text-xs text-foreground-muted/60 bg-card/20 gap-1">
            <span>No tasks</span>
          </div>
        ) : (
          props.tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onStatusChange={updateTaskStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}

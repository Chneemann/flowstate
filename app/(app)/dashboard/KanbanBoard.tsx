/**
 * @file dashboard/KanbanBoard.tsx
 * @description Client component wrapping the kanban columns grid, tracking individual task update states, and handling asynchronous status mutations via API.
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import KanbanColumn from "./KanbanColumn";
import { KANBAN_COLUMNS, Task, TaskStatus } from "@/types/tasks";

/**
 * Renders the responsive grid container of kanban columns, coordinating state tracking
 * for active task updates and triggering status mutation API requests.
 *
 * @param {Object} props - The component props.
 * @param {Task[]} props.tasks - The array of task items displayed across the board.
 * @returns {JSX.Element} The rendered kanban board component.
 */
export default function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [updatingTaskIds, setUpdatingTaskIds] = useState<Set<string>>(
    new Set(),
  );

  /**
   * Updates the status of a specific task by sending a PATCH request to the API,
   * managing loading states, and refreshing the router upon success.
   *
   * @param {string} taskId - The unique identifier of the task to update.
   * @param {TaskStatus} targetStatus - The new target status for the task.
   */
  const updateTaskStatus = (taskId: string, targetStatus: TaskStatus) => {
    setUpdatingTaskIds((prev) => new Set(prev).add(taskId));

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

        await router.refresh();
      } catch (error) {
        console.error("Error during task status update:", error);
      } finally {
        setUpdatingTaskIds((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
      {KANBAN_COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);
        return (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            count={columnTasks.length}
            tasks={columnTasks}
            color={col.color}
            updatingTaskIds={updatingTaskIds}
            onTaskMove={updateTaskStatus}
          />
        );
      })}
    </div>
  );
}

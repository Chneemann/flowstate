/**
 * @file dashboard/Board.tsx
 * @description Client component wrapping the columns grid, tracking individual task update/deletion states, and handling asynchronous mutations via API with cache revalidation.
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Column from "./column/Column";
import { COLUMNS, Task, TaskStatus } from "@/types/task";
import Header from "./header/Header";
import { mutate } from "swr";

/**
 * Renders the responsive grid container of columns, coordinating state tracking
 * for active task updates/deletions, and triggering mutation API requests.
 *
 * @param {Object} props - The component props.
 * @param {Task[]} props.tasks - The array of task items displayed across the board.
 * @returns {JSX.Element} The rendered board component.
 */
export default function Board({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [updatingTaskIds, setUpdatingTaskIds] = useState<Set<string>>(
    new Set(),
  );

  /**
   * Updates the status of a specific task by sending a PATCH request to the API,
   * managing loading states, triggering SWR cache mutations for the trash count, and refreshing the router upon success.
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
        mutate("/api/trash/count");
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

  /**
   * Deletes a specific task by sending a DELETE request to the API,
   * managing loading states, triggering SWR cache mutations for the trash count, and refreshing the router upon success.
   *
   * @param {string} taskId - The unique identifier of the task to delete.
   */
  const deleteTask = (taskId: string) => {
    setUpdatingTaskIds((prev) => new Set(prev).add(taskId));

    startTransition(async () => {
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete task");
        mutate("/api/trash/count");
        await router.refresh();
      } catch (error) {
        console.error("Error during task deletion:", error);
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
    <div className="space-y-8">
      {/* Workspace Header */}
      <Header onTaskDelete={deleteTask} />

      {/* Columns Grid */}
      <div className="grid grid-auto-fit-450 gap-4 items-start">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.id);
          return (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              count={columnTasks.length}
              tasks={columnTasks}
              color={col.color}
              updatingTaskIds={updatingTaskIds}
              onTaskMove={updateTaskStatus}
              onTaskDelete={deleteTask}
            />
          );
        })}
      </div>
    </div>
  );
}

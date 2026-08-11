/**
 * @file trash/TrashList.tsx
 * @description Client component rendering the list of deleted tasks with rich metadata, priority badges, and restore/delete actions.
 */

"use client";

import { Task, PRIORITY_CONFIG } from "@/types/tasks";
import { Calendar } from "lucide-react";
import TaskActionButton from "./components/TaskActionButton";

/**
 * Renders a list of deleted tasks stored in the trash, featuring priority badges,
 * deletion dates, and action controls for permanent deletion or restoration.
 *
 * @param {Object} props - The component props.
 * @param {Task[]} props.tasks - The array of deleted tasks to render.
 * @returns {JSX.Element} The rendered trash list component or an empty state placeholder.
 */
export default function TrashList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="grid gap-4">
      {tasks.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-3xl bg-card/20 space-y-2">
          <p className="text-sm font-medium text-foreground-muted">
            No deleted tasks found.
          </p>
          <p className="text-xs text-foreground-muted/65">
            Your trash is completely empty.
          </p>
        </div>
      ) : (
        tasks.map((task) => {
          const priorityConfig =
            PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG] ||
            PRIORITY_CONFIG.medium;

          const deletedDate = task.deletedAt
            ? new Date(task.deletedAt).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Unknown";

          return (
            <div
              key={task.id}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-card/40 border border-border/80 rounded-2xl hover:border-primary/40 hover:bg-card/70 transition-all duration-200 shadow-sm overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/40 group-hover:bg-rose-500 transition-colors" />

              {/* --- Left Side --- */}
              <div className="flex flex-col gap-2 pl-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
                    {task.title}
                  </h3>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${priorityConfig.className}`}
                  >
                    {priorityConfig.label}
                  </span>
                </div>

                {task.description && (
                  <p className="text-xs text-foreground-muted line-clamp-1">
                    {task.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/60 text-foreground-muted border border-border/60">
                    <Calendar size={12} className="text-foreground-muted/70" />
                    Deleted {deletedDate}
                  </span>
                </div>
              </div>

              {/* --- Right Side --- */}
              <div className="flex sm:flex-col flex-row sm:items-stretch items-center justify-end sm:pt-2 pt-0 sm:border-t border-t-0 border-border/60 gap-2">
                <TaskActionButton taskId={task.id} action="delete" />
                <TaskActionButton taskId={task.id} action="restore" />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

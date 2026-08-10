/**
 * @file dashboard/components/KanbanCardDueDate.tsx
 * @description Client component rendering the due date badge with overdue status indicators and hover time display.
 */

import { AlertCircle, CalendarDays } from "lucide-react";
import { Task } from "@/types/tasks";

/**
 * Renders a due date badge for a kanban card, showing an overdue alert animation
 * if the deadline has passed and the task is not completed, alongside a hoverable time display.
 *
 * @param {Object} props - The component props.
 * @param {Task} props.task - The task object containing the due date and status information.
 * @returns {JSX.Element | null} The rendered due date badge component or null if no due date is set.
 */
export default function KanbanCardDueDate({ task }: { task: Task }) {
  if (!task.dueDate) return null;

  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "done";

  return (
    <div
      className={`group/date relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border border-border transition-all duration-200 ease-out cursor-default ${
        isOverdue
          ? "bg-destructive/10 text-destructive border-destructive/40 animate-pulse"
          : "bg-background/50 text-foreground-muted border-border/40"
      }`}
    >
      {isOverdue ? <AlertCircle size={13} /> : <CalendarDays size={13} />}
      <span>
        {new Date(task.dueDate).toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "short",
        })}
      </span>
      <span className="grid grid-cols-[0fr] group-hover/date:grid-cols-[1fr] transition-all duration-200 ease-out">
        <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover/date:opacity-100 transition-opacity duration-200">
          {new Date(task.dueDate).toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </span>
    </div>
  );
}

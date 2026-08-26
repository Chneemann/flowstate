/**
 * @file app/(app)/dashboard/modal/TaskModalContent.tsx
 * @description Client component rendering the scrollable inner details of the task modal.
 */

import { Task, PRIORITY_CONFIG } from "@/lib/types/task";
import { getFullName, getStatusColor } from "@/lib/utils/user";
import {
  X,
  CalendarDays,
  AlertCircle,
  User,
  Users,
  FileText,
} from "lucide-react";

/**
 * Properties for the TaskModalContent component.
 *
 * @interface TaskModalContentProps
 * @property {Task} task - The task entity containing header, assignee, priority, and date details.
 * @property {() => void} onClose - Callback handler to trigger closing the modal overlay.
 */
interface TaskModalContentProps {
  task: Task;
  onClose: () => void;
}

/**
 * Renders the body content of the task detail modal including title, badges, description, creator, due date, and assignees.
 *
 * @param {TaskModalContentProps} props - The component props.
 * @returns {JSX.Element} The rendered scrollable task details section.
 */
export default function TaskModalContent({
  task,
  onClose,
}: TaskModalContentProps) {
  const priorityConfig = task.priority && PRIORITY_CONFIG[task.priority];
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  return (
    <div className="p-8 space-y-6 overflow-y-auto flex-1">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/25 uppercase">
              {task.status}
            </span>
            {priorityConfig && (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border-2 shrink-0 ${priorityConfig.className}`}
              >
                {priorityConfig.label}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight leading-snug">
            {task.title}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-foreground-muted hover:text-foreground p-2 rounded-xl bg-background/50 hover:bg-background border border-border transition-all cursor-pointer shrink-0"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Description */}
      <div className="space-y-2.5">
        <div className="flex items-center space-x-2 text-foreground-muted">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Description
          </span>
        </div>
        <div className="text-sm text-foreground bg-background-muted/60 p-4 rounded-2xl border border-border/60 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
          {task.description || "No description provided for this task."}
        </div>
      </div>

      {/* Meta Grid (Creator & Due Date) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3.5 bg-background-muted/40 p-3.5 rounded-2xl border border-border/60">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-foreground-muted font-medium">Creator</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {getFullName(task.creator.firstName, task.creator.lastName)}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center space-x-3.5 p-3.5 rounded-2xl border transition-all ${isOverdue ? "bg-destructive/10 border-destructive/40 text-destructive animate-pulse" : "bg-background-muted/40 border-border/60 text-foreground"}`}
        >
          <div
            className={`p-2.5 rounded-xl border shadow-sm ${isOverdue ? "bg-destructive/20 border-destructive/30 text-destructive" : "bg-accent/10 border-accent/20 text-accent"}`}
          >
            {isOverdue ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <CalendarDays className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <p
              className={`text-xs font-medium ${isOverdue ? "text-destructive/80" : "text-foreground-muted"}`}
            >
              {isOverdue ? "Overdue Due Date" : "Due Date"}
            </p>
            <p className="text-sm font-semibold truncate">
              {task.dueDate
                ? `${new Date(task.dueDate).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })} (${new Date(task.dueDate).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })})`
                : "No due date"}
            </p>
          </div>
        </div>
      </div>

      {/* Assignees */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center space-x-2 text-foreground-muted">
          <Users className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Assignees ({task.assignees.length})
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {task.assignees.length > 0 ? (
            task.assignees.map((a) => (
              <div
                key={a.id}
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-background-muted/60 border border-border/60 text-foreground text-xs font-medium shadow-sm"
              >
                <span
                  className={`w-2 h-2 rounded-full shadow-sm ${getStatusColor(a.isOnline ?? false)}`}
                />
                <span>{getFullName(a.firstName, a.lastName)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-foreground-muted italic bg-background-muted/20 p-3 rounded-xl border border-border/40 w-full text-center">
              No assignees assigned to this task.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

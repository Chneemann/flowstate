/**
 * @file app/(app)/dashboard/modal/TaskModal.tsx
 * @description Client component rendering a detailed modal overlay for viewing task metadata, status, assignees, and quick actions with ESC key support.
 */

"use client";

import { useEffect } from "react";
import { Task, PRIORITY_CONFIG } from "@/lib/types/task";
import { getFullName, getStatusColor } from "@/lib/utils/user";
import {
  X,
  CalendarDays,
  AlertCircle,
  User,
  Users,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Properties for the TaskModal component.
 *
 * @interface TaskModalProps
 * @property {Task | null} task - The selected task object to display, or null if hidden.
 * @property {() => void} onClose - Callback handler to close the modal dialog.
 * @property {(taskId: string) => void} [onDelete] - Optional callback function triggered when deleting the task.
 */
interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onDelete?: (taskId: string) => void;
}

/**
 * Renders a full task detail modal with status indicators, priority details, description, assignees, and creator-only action buttons.
 * Supports ESC key navigation and updates URL query parameters dynamically.
 *
 * @param {TaskModalProps} props - The component props.
 * @returns {JSX.Element | null} The rendered modal component or null when no task is selected.
 */
export default function TaskModal({ task, onClose, onDelete }: TaskModalProps) {
  const router = useRouter();

  useEffect(() => {
    /**
     * Attaches a global keydown event listener to close the modal when the Escape key is pressed.
     *
     * @param {KeyboardEvent} e - The keyboard event object.
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    /**
     * Updates the URL search parameters to include `modal=task-detail` when a task is selected,
     * maintaining modal state in the browser history without triggering a full page re-render.
     */
    if (task) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("modal") !== "task-detail") {
        params.set("modal", "task-detail");
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?${params.toString()}`,
        );
      }
    }
  }, [task]);

  /**
   * Removes modal query parameters from the browser location history without causing a Next.js soft navigation, then triggers onClose.
   */
  const handleClose = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("modal");
    const newQuery = params.toString();

    window.history.replaceState(
      {},
      "",
      newQuery
        ? `${window.location.pathname}?${newQuery}`
        : window.location.pathname,
    );

    onClose();
  };

  if (!task) return null;

  const priorityConfig = task.priority && PRIORITY_CONFIG[task.priority];
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  return (
    <div
      className="fixed inset-0 z-49 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-card border border-border rounded-3xl max-w-xl w-full max-h-[80vh] md:max-h-[90vh] shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dynamic Status Indicator Strip */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 z-10 ${
            task.status === "done"
              ? "bg-emerald-500"
              : task.priority === "high"
                ? "bg-destructive"
                : "bg-linear-to-r from-primary to-accent"
          }`}
        />

        {/* --- SCROLLABLE CONTENT AREA --- */}
        <div className="p-8 space-y-6 overflow-y-auto flex-1">
          {/* Header / Status, Priority & Title */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/25 tracking-wide uppercase">
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
              onClick={handleClose}
              className="text-foreground-muted hover:text-foreground p-2 rounded-xl bg-background/50 hover:bg-background border border-border transition-all cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description Section */}
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
            {/* Creator */}
            <div className="flex items-center space-x-3.5 bg-background-muted/40 p-3.5 rounded-2xl border border-border/60">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-foreground-muted font-medium">
                  Creator
                </p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {getFullName(task.creator.firstName, task.creator.lastName)}
                </p>
              </div>
            </div>

            {/* Due Date */}
            <div
              className={`flex items-center space-x-3.5 p-3.5 rounded-2xl border transition-all ${
                isOverdue
                  ? "bg-destructive/10 border-destructive/40 text-destructive animate-pulse"
                  : "bg-background-muted/40 border-border/60 text-foreground"
              }`}
            >
              <div
                className={`p-2.5 rounded-xl border shadow-sm ${
                  isOverdue
                    ? "bg-destructive/20 border-destructive/30 text-destructive"
                    : "bg-accent/10 border-accent/20 text-accent"
                }`}
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
                    ? `${new Date(task.dueDate).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })} (${new Date(task.dueDate).toLocaleTimeString(
                        "de-DE",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )})`
                    : "No due date"}
                </p>
              </div>
            </div>
          </div>

          {/* Assignees Section */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center space-x-2 text-foreground-muted">
              <Users className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Assignees ({task.assignees.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.assignees.length > 0 ? (
                task.assignees.map((assignee) => (
                  <div
                    key={assignee.id}
                    className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-background-muted/60 border border-border/60 text-foreground text-xs font-medium shadow-sm"
                  >
                    <span
                      className={`w-2 h-2 rounded-full shadow-sm ${getStatusColor(
                        assignee.isOnline ?? false,
                      )}`}
                    />
                    <span>
                      {getFullName(assignee.firstName, assignee.lastName)}
                    </span>
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

        {/* Footer Actions */}
        {task.isCreator && (
          <div className="flex items-center justify-end gap-3 px-8 py-4 bg-card border-t border-border/80 shrink-0">
            <button
              onClick={() => {
                onDelete?.(task.id);
                handleClose();
              }}
              className="inline-flex items-center space-x-2 px-4 py-2.5 text-sm font-medium bg-destructive-bg text-destructive border border-destructive-border hover:bg-destructive/20 rounded-xl transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>

            <button
              onClick={() => {
                router.push(`/tasks?task=edit&id=${task.id}`);
              }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold bg-primary text-background hover:bg-primary-hover rounded-xl transition-all shadow-lg shadow-primary/10 cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit Task</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

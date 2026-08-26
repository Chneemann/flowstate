/**
 * @file app/(app)/dashboard/modal/TaskModal.tsx
 * @description Client component orchestrating the task modal overlay, history sync, and action buttons.
 */

"use client";

import { useEffect } from "react";
import { Task } from "@/lib/types/task";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import TaskModalContent from "./TaskModalContent";

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
 * Renders the task detail modal container with URL state synchronization, keyboard event handling, and action triggers.
 *
 * @param {TaskModalProps} props - The component props.
 * @returns {JSX.Element | null} The rendered modal overlay or null when no task is selected.
 */
export default function TaskModal({ task, onClose, onDelete }: TaskModalProps) {
  const router = useRouter();

  useEffect(() => {
    /**
     * Handles keyboard events to close the modal when the Escape key is pressed.
     *
     * @param {KeyboardEvent} e - The keyboard event instance.
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
   * Removes modal query parameters from browser history without triggering Next.js routing, then executes the onClose callback.
   */
  const handleClose = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("modal");
    const query = params.toString();
    window.history.replaceState(
      {},
      "",
      query ? `${window.location.pathname}?${query}` : window.location.pathname,
    );
    onClose();
  };

  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-49 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-card border border-border rounded-3xl max-w-xl w-full max-h-[80vh] md:max-h-[90vh] shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Status Indikator */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 z-10 ${task.status === "done" ? "bg-emerald-500" : task.priority === "high" ? "bg-destructive" : "bg-linear-to-r from-primary to-accent"}`}
        />

        {/* Content */}
        <TaskModalContent task={task} onClose={handleClose} />

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
              onClick={() => router.push(`/tasks?task=edit&id=${task.id}`)}
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

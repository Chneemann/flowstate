/**
 * @file tasks/task/TaskHeader.tsx
 * @description Component rendering the top title header and action buttons for the task view.
 */

import { Sparkles } from "lucide-react";

/**
 * Renders the task management header section featuring dynamic title and subtitle text based on edit mode.
 *
 * @param {boolean} [isEditMode] - Flag indicating whether the header is displayed in edit mode or creation mode.
 * @returns {JSX.Element} The rendered task header component.
 */
export default function TaskHeader({ isEditMode }: { isEditMode?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-wider mb-1">
          <Sparkles size={14} />
          Task Management
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          {isEditMode ? "Edit Task" : "Create New Task"}
        </h1>
        <p className="text-sm text-foreground-muted mt-1">
          {isEditMode
            ? "Update your existing task details and assignees."
            : "Add a new task to your workspace and assign priorities."}
        </p>
      </div>
    </div>
  );
}

/**
 * @file app/(app)/tasks/TaskForm.tsx
 * @description Client component orchestrating modular sub-components for task creation and editing.
 */

"use client";

import { AlertCircle, Check, X } from "lucide-react";
import { DbTask, TaskStatus } from "@/lib/types/task";
import { useTaskForm } from "./useTaskForm";
import TaskHeader from "./task/TaskHeader";
import TaskBasicInfo from "./task/TaskBasicInfo";
import TaskOptions from "./task/TaskOptions";
import TaskAssignees from "./task/TaskAssignees";
import TaskDateTime from "./task/TaskDateTime";
import { ActionButton } from "@/app/components/ui/buttons/ActionButton";

/**
 * Properties for the TaskForm component.
 *
 * @interface TaskFormProps
 * @property {{ id: string; email: string }[]} users - The list of available users who can be assigned to the task.
 * @property {DbTask & { assignees?: { id: string }[] }} [initialData] - Optional initial task data for editing an existing task.
 * @property {string} [mode] - Optional mode indicator (e.g., create or edit).
 * @property {string | null} [serverError] - Optional server-side error message.
 * @property {TaskStatus} [defaultStatus] - Optional default status for new tasks.
 */
interface TaskFormProps {
  users: { id: string; email: string }[];
  initialData?: DbTask & { assignees?: { id: string }[] };
  mode?: string;
  serverError?: string | null;
  defaultStatus?: TaskStatus;
}

/**
 * Renders a complete task form layout combining various sub-components for basic info,
 * options, assignees, and date/time selections, alongside error alerts and form submission controls.
 *
 * @param {TaskFormProps} props - The component props.
 * @returns {JSX.Element} The rendered task form component.
 */
export default function TaskForm({
  users,
  initialData,
  mode,
  defaultStatus,
}: TaskFormProps) {
  const {
    form,
    error,
    isEditMode,
    todayString,
    updateField,
    handleAssigneeToggle,
    handleSubmit,
  } = useTaskForm(initialData, mode, defaultStatus);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mx-auto">
      <TaskHeader isEditMode={!!isEditMode} />

      {error && (
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-card/40 border border-border/80 p-6 rounded-2xl shadow-sm space-y-4">
        <TaskBasicInfo
          title={form.title}
          setTitle={(v) => updateField("title", v)}
          description={form.description}
          setDescription={(v) => updateField("description", v)}
        />
        <TaskOptions
          priority={form.priority}
          setPriority={(v) => updateField("priority", v)}
          status={form.status}
          setStatus={(v) => updateField("status", v)}
        />
        <TaskAssignees
          users={users}
          selectedAssignees={form.assignees}
          onToggle={handleAssigneeToggle}
        />
        <TaskDateTime
          dueDate={form.dueDate}
          setDueDate={(v) => updateField("dueDate", v)}
          dueTime={form.dueTime}
          setDueTime={(v) => updateField("dueTime", v)}
          todayString={todayString}
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <ActionButton href="/dashboard" variant="secondary" icon={X}>
          Cancel
        </ActionButton>
        <ActionButton type="submit" variant="primary" icon={Check}>
          {isEditMode ? "Save Changes" : "Create Task"}
        </ActionButton>
      </div>
    </form>
  );
}

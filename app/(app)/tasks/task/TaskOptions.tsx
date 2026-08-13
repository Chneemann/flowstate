/**
 * @file tasks/task/TaskOptions.tsx
 * @description Component for selecting priority and status using centralized type definitions.
 */

import { TaskPriority, TaskStatus, COLUMNS } from "@/types/task";

/**
 * Properties for the TaskOptions component.
 *
 * @interface TaskOptionsProps
 * @property {TaskPriority} priority - The currently selected task priority level.
 * @property {(val: TaskPriority) => void} setPriority - Callback function to update the task priority.
 * @property {TaskStatus} status - The currently selected task status.
 * @property {(val: TaskStatus) => void} setStatus - Callback function to update the task status.
 */
interface TaskOptionsProps {
  priority: TaskPriority;
  setPriority: (val: TaskPriority) => void;
  status: TaskStatus;
  setStatus: (val: TaskStatus) => void;
}

/**
 * Renders form option selectors for task priority and initial status dropdowns.
 *
 * @param {TaskOptionsProps} props - The component props.
 * @returns {JSX.Element} The rendered task options component.
 */
export default function TaskOptions({
  priority,
  setPriority,
  status,
  setStatus,
}: TaskOptionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Priority */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Status (dynamisch aus deinen Kanban-Spalten) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
          Initial Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
        >
          {COLUMNS.map((col) => (
            <option key={col.id} value={col.id}>
              {col.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

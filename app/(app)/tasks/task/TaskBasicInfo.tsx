/**
 * @file tasks/task/TaskBasicInfo.tsx
 * @description Component for title and description input fields.
 */

/**
 * Properties for the TaskBasicInfo component.
 *
 * @interface TaskBasicInfoProps
 * @property {string} title - The current title value of the task.
 * @property {(val: string) => void} setTitle - Callback function to update the task title state.
 * @property {string} description - The current description value of the task.
 * @property {(val: string) => void} setDescription - Callback function to update the task description state.
 */
interface TaskBasicInfoProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
}

/**
 * Renders form fields for entering and updating a task's basic information (title and description).
 *
 * @param {TaskBasicInfoProps} props - The component props.
 * @returns {JSX.Element} The rendered task basic information form inputs.
 */
export default function TaskBasicInfo({
  title,
  setTitle,
  description,
  setDescription,
}: TaskBasicInfoProps) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
          Title *
        </label>
        <input
          type="text"
          required
          maxLength={255}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Redesign Landing Page"
          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
          Description *
        </label>
        <textarea
          rows={4}
          required
          maxLength={2000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about this task..."
          className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
        />
      </div>
    </div>
  );
}

/**
 * @file app/(app)/tasks/task/TaskAssignees.tsx
 * @description Component for selecting task assignees.
 */

/**
 * Properties for the TaskAssignees component.
 *
 * @interface TaskAssigneesProps
 * @property {Array<{ id: string; email: string }>} users - The list of available users to assign.
 * @property {string[]} selectedAssignees - An array containing the IDs of currently selected assignees.
 * @property {(userId: string) => void} onToggle - Callback function triggered when a user selection is toggled.
 */
interface TaskAssigneesProps {
  users: { id: string; email: string }[];
  selectedAssignees: string[];
  onToggle: (userId: string) => void;
}

/**
 * Renders an interactive list of users allowing selection or deselection of assignees for a task.
 *
 * @param {TaskAssigneesProps} props - The component props.
 * @returns {JSX.Element} The rendered task assignees selector component.
 */
export default function TaskAssignees({
  users,
  selectedAssignees,
  onToggle,
}: TaskAssigneesProps) {
  return (
    <div className="space-y-2 pt-2 border-t border-border/60">
      <label className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
        Assignees
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-border rounded-xl bg-background">
        {users.length === 0 ? (
          <span className="text-xs text-foreground-muted p-2">
            No other users found
          </span>
        ) : (
          users.map((user) => {
            const isSelected = selectedAssignees.includes(user.id);
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => onToggle(user.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 border border-primary/40 text-foreground"
                    : "bg-card/40 border border-border/40 hover:bg-background-muted text-foreground-muted"
                }`}
              >
                <span className="truncate">{user.email}</span>
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[10px] ${
                    isSelected
                      ? "bg-primary border-primary text-background font-bold"
                      : "border-border"
                  }`}
                >
                  {isSelected ? "✓" : ""}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

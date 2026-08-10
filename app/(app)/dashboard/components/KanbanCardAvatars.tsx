/**
 * @file dashboard/components/KanbanCardAvatars.tsx
 * @description Client component rendering team avatars and creator badge for a kanban card.
 */

"use client";

import { Crown } from "lucide-react";
import { Task } from "@/types/tasks";

/**
 * Renders overlapping avatar indicators for task assignees and a dedicated, crowned badge for the task creator.
 * Filters out duplicate entries where the assignee matches the creator.
 *
 * @param {Object} props - The component props.
 * @param {Task["creator"]} props.creator - The email or identifier of the task creator.
 * @param {Task["assignees"]} [props.assignees=[]] - An array of emails or identifiers for users assigned to the task.
 * @returns {JSX.Element | null} The rendered avatars container, or null if neither creator nor assignees exist.
 */
export default function KanbanCardAvatars({
  creator,
  assignees = [],
}: {
  creator: Task["creator"];
  assignees: Task["assignees"];
}) {
  const filteredAssignees = (assignees || []).filter((a) => a !== creator);

  if (!creator && filteredAssignees.length === 0) return null;

  return (
    <div className="flex items-center shrink-0 -space-x-2.5 group/avatars hover:space-x-0.5 transition-all duration-300">
      {filteredAssignees.map((assignee, index) => (
        <div
          key={index}
          className="w-7 h-7 rounded-full bg-primary/25 border-2 border-card flex items-center justify-center text-xs font-bold text-primary shadow-md group-hover/avatars:scale-110 transition-transform duration-200 ring-2 ring-border/50 group-hover/avatars:ring-primary/20 cursor-default"
          title={`Assignee: ${assignee}`}
        >
          {assignee.substring(0, 2).toUpperCase()}
        </div>
      ))}
      {creator && (
        <div
          className="relative w-7 h-7 rounded-full bg-amber-500 text-white border-2 border-card flex items-center justify-center text-xs font-bold shadow-lg group-hover/avatars:scale-110 transition-transform duration-200 ring-2 ring-border/50 group-hover/avatars:ring-amber-500/20 cursor-default"
          title={`Creator: ${creator}`}
        >
          {creator.substring(0, 2).toUpperCase()}
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-600 rounded-full border-2 border-card flex items-center justify-center">
            <Crown size={8} className="text-white" />
          </span>
        </div>
      )}
    </div>
  );
}

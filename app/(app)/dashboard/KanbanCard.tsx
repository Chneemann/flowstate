/**
 * @file dashboard/KanbanCard.tsx
 * @description Client component rendering a simplified kanban task card displaying title, priority, description, and metadata.
 */

"use client";

import { KanbanCardProps } from "@/types/tasks";

/**
 * Renders a task card component with a basic layout for title, priority, description, due date, and creator info.
 *
 * @param {KanbanCardProps} props - The component props containing the task object.
 * @returns {JSX.Element} The rendered kanban card component.
 */
export default function KanbanCard({ task }: KanbanCardProps) {
  const assignees = task.assignees || [];

  return (
    <div className="flex flex-col gap-2 text-xs">
      {/* Title & Priority */}
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-base">{task.title}</span>
        {task.priority && (
          <span className="text-xs uppercase">{task.priority}</span>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-500 line-clamp-2 text-sm">{task.description}</p>
      )}

      {/* Footer / Meta & People */}
      <div className="flex items-center justify-between pt-2 mt-1 border-t text-xs">
        <div>
          {task.dueDate && (
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {task.creator && (
            <span
              className="px-1.5 py-0.5 bg-gray-900 text-white rounded text-xs font-medium"
              title={`Creator: ${task.creator}`}
            >
              {task.creator.substring(0, 2).toUpperCase()}
            </span>
          )}
          {assignees.map((assignee, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
              title={`Assignee: ${assignee}`}
            >
              {assignee.substring(0, 2).toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

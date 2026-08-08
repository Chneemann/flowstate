/**
 * @file dashboard/KanbanColumn.tsx
 * @description Client component rendering a single column in the kanban board, containing a status header, count, task list, and fallback empty states.
 */

"use client";

import { Plus } from "lucide-react";
import KanbanCard from "./KanbanCard";
import { KanbanColumnProps } from "@/types/tasks";

/**
 * Renders a kanban column with an indicator color, title, task count, quick-add trigger,
 * and a list of rendered task cards or an empty placeholder.
 *
 * @param {KanbanColumnProps} props - The component props defining column metadata and task lists.
 * @returns {JSX.Element} The rendered kanban column component.
 */
export default function KanbanColumn(props: KanbanColumnProps) {
  return (
    <div className="flex flex-col p-2 gap-2 w-full bg-background-muted rounded">
      {/* Header */}
      <div className="flex items-center justify-between px-1 py-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${props.color ?? "bg-gray-400"}`}
          />
          <h2 className="text-sm font-medium">{props.title}</h2>
          <span className="text-sm">{props.count}</span>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
          <Plus size={14} />
        </button>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-2">
        {props.tasks.length === 0 ? (
          <div className="p-4 text-sm text-center border border-dashed rounded bg-card">
            No tasks
          </div>
        ) : (
          props.tasks.map((task) => (
            <div key={task.id} className="p-3 border rounded shadow-sm bg-card">
              <KanbanCard task={task} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

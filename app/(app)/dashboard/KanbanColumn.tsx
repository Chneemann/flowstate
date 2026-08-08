/**
 * @file dashboard/KanbanColumn.tsx
 * @description Client component rendering an individual kanban column container with its header, task count, action button, and list of task cards.
 */

"use client";

import { Plus } from "lucide-react";
import KanbanCard from "./KanbanCard";
import { KanbanColumnProps } from "@/types/tasks";

/**
 * Renders a kanban column containing a header with category indicator and counter,
 * an add button, and a sorted list of associated task cards or an empty placeholder.
 *
 * @param {KanbanColumnProps} props - The component props including column details, task list, and styling options.
 * @returns {JSX.Element} The rendered kanban column component.
 */
export default function KanbanColumn(props: KanbanColumnProps) {
  const indicatorColor = props.color ?? "bg-primary";

  return (
    <div className="w-full flex flex-col rounded-2xl p-4 transition-all duration-300 bg-background-muted/40 border border-border">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full shadow-sm ${indicatorColor}`}
          />
          <h2 className="font-bold text-xs uppercase tracking-wider text-foreground">
            {props.title}
          </h2>
          <span className="text-xs bg-card text-foreground-muted px-2 py-0.5 rounded-full font-semibold border border-border/60">
            {props.count}
          </span>
        </div>
        <button className="text-background hover:text-foreground p-1.5 rounded-lg bg-primary hover:bg-primary-hover transition-all duration-200 cursor-pointer shadow-sm active:scale-95">
          <Plus size={14} />
        </button>
      </div>

      {/* Card List */}

      <div className="flex flex-col gap-3">
        {props.tasks.length === 0 ? (
          <div className="h-28 rounded-xl border border-dashed border-border/80 flex flex-col items-center justify-center text-xs text-foreground-muted/60 bg-card/20 gap-1">
            <span>No tasks</span>
          </div>
        ) : (
          props.tasks.map((task) => (
            <div
              key={task.id}
              className="group relative bg-card/40 border border-border/80 hover:border-primary/60 p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 space-y-3 hover:-translate-y-0.5"
            >
              <KanbanCard key={task.id} task={task} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

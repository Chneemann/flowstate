/**
 * @file dashboard/KanbanCard.tsx
 * @description Client component rendering an individual task card within a kanban column, featuring priority configuration, due dates, overdue highlights, and user avatars.
 */

"use client";
import { AlertCircle, Crown, CalendarDays } from "lucide-react";
import { KanbanCardProps } from "@/types/tasks";

/**
 * Renders a task card component displaying its title, priority badge, description,
 * deadline with hover time details, and creator/assignee avatars.
 *
 * @param {KanbanCardProps} props - The component props containing the task object.
 * @returns {JSX.Element} The rendered kanban card component.
 */
export default function KanbanCard({ task }: KanbanCardProps) {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  const filteredAssignees = (task.assignees || []).filter(
    (a) => a !== task.creator,
  );

  return (
    <div className="flex flex-col h-full gap-3">
      {/* --- Card Header (Title & Priority) --- */}
      <div className="flex items-start justify-between gap-2">
        {/* Title */}
        <h3 className="font-semibold leading-snug group-hover/card:text-primary transition-colors line-clamp-2">
          {task.title}
        </h3>

        {/* Priority Badge */}
        {task.priority && (
          <span
            className={`gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border-2 ${
              task.priority === "high"
                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                : task.priority === "medium"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
            }`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        )}
      </div>

      {/* Card Description */}
      <p className="text-sm leading-relaxed text-foreground-muted line-clamp-3">
        {task.description}
      </p>

      {/* --- Card Footer (Date, Mobile Action Menu, Avatars) --- */}
      <div className="flex items-center justify-between pt-3 mt-auto text-xs border-t border-border">
        {/* Left Side: Date Badge */}
        {task.dueDate && (
          <div
            className={`group/date relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border border-border transition-all duration-200 ease-out cursor-default ${
              isOverdue
                ? "bg-destructive/10 text-destructive border-destructive/40 animate-pulse"
                : "bg-background/50 text-foreground-muted border-border/40"
            }`}
          >
            {isOverdue ? <AlertCircle size={13} /> : <CalendarDays size={13} />}
            <span>
              {new Date(task.dueDate).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "short",
              })}
            </span>

            {/* Time displayed when hovering over the badge */}
            <span className="grid grid-cols-[0fr] group-hover/date:grid-cols-[1fr] transition-all duration-200 ease-out">
              <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover/date:opacity-100 transition-opacity duration-200">
                {new Date(task.dueDate).toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </span>
          </div>
        )}

        {/* Right Side: Avatars & Mobile Switcher */}
        <div className="flex items-center gap-2">
          {/* Avatars */}
          {(task.creator || filteredAssignees.length > 0) && (
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
              {task.creator && (
                <div
                  className="relative w-7 h-7 rounded-full bg-amber-500 text-white border-2 border-card flex items-center justify-center text-xs font-bold shadow-lg group-hover/avatars:scale-110 transition-transform duration-200 ring-2 ring-border/50 group-hover/avatars:ring-amber-500/20 cursor-default"
                  title={`Creator: ${task.creator}`}
                >
                  {task.creator.substring(0, 2).toUpperCase()}
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-600 rounded-full border-2 border-card flex items-center justify-center">
                    <Crown size={8} className="text-white" />
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * @file dashboard/KanbanCard.tsx
 * @description Client component rendering a single kanban card with support for priority indicators, due date alerts, team avatars, and a mobile status dropdown.
 */

"use client";

import {
  AlertCircle,
  Crown,
  MoreHorizontal,
  CornerDownRight,
  CalendarDays,
} from "lucide-react";
import { KANBAN_COLUMNS, KanbanCardProps, TaskStatus } from "@/types/tasks";
import { useState, useEffect, useRef } from "react";

/**
 * Renders an interactive kanban card featuring title, description, priority levels,
 * deadline alerts, team avatars, and a mobile-friendly status-shifting dropdown menu.
 *
 * @param {KanbanCardProps} props - The component props containing the task object and status change handler.
 * @returns {JSX.Element} The rendered kanban card component.
 */
export default function KanbanCard({ task, onStatusChange }: KanbanCardProps) {
  const [showMobileActions, setShowMobileActions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMobileActions(false);
      }
    };

    if (showMobileActions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileActions]);

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  const filteredAssignees = (task.assignees || []).filter(
    (a) => a !== task.creator,
  );

  /**
   * Handles shifting the task to a new status category.
   *
   * @param {React.MouseEvent} e - The mouse event triggered by clicking a column destination.
   * @param {TaskStatus} newStatus - The target task status to transition to.
   */
  const handleMove = (e: React.MouseEvent, newStatus: TaskStatus) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
    setShowMobileActions(false);
  };

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

          {/* Mobile Switcher */}
          <div className="relative sm:hidden" ref={dropdownRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMobileActions(!showMobileActions);
              }}
              className="p-1.5 rounded-lg border border-border bg-background/50 text-foreground-muted transition-all cursor-pointer hover:text-foreground hover:border-primary-hover flex items-center justify-center"
              title="Move Task"
            >
              <MoreHorizontal size={14} />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 bottom-8 z-50 w-50 bg-card border border-border rounded-xl shadow-2xl p-1.5 space-y-1 text-xs origin-bottom-right transition-all duration-200 ease-out ${
                showMobileActions
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-10 pointer-events-none"
              }`}
            >
              {KANBAN_COLUMNS.map((col) => {
                if (col.id === task.status) return null;
                return (
                  <button
                    key={col.id}
                    onClick={(e) => handleMove(e, col.id)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-border flex items-center justify-between hover:text-primary group/btn transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${col.color}`}
                      />
                      {col.title}
                    </span>
                    <CornerDownRight
                      size={12}
                      className="text-foreground-muted group-hover/btn:text-primary transition-all"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

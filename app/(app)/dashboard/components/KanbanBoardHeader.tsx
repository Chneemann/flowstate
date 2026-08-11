/**
 * @file dashboard/components/KanbanBoardHeader.tsx
 * @description Component rendering the top title header with an integrated delete drop zone that appears during drag-and-drop interactions, plus a link to the trash bin view.
 */

"use client";

import { useState, useEffect } from "react";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";

/**
 * Renders the dashboard header featuring a workspace title, subtitle, new task action button,
 * a dynamic delete drop zone during drag operations, and a trash navigation link with a counter badge.
 *
 * @param {Object} props - The component props.
 * @param {(taskId: string) => void} props.onTaskDelete - Callback function invoked when a task is dropped into the delete zone.
 * @param {number} props.trashCount - The current count of items in the trash bin.
 * @returns {JSX.Element} The rendered kanban board header component.
 */
export default function KanbanBoardHeader({
  onTaskDelete,
  trashCount,
}: {
  onTaskDelete: (taskId: string) => void;
  trashCount: number;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const handleDragStart = () => setIsDragging(true);
    const handleDragEnd = () => {
      setIsDragging(false);
      setIsOver(false);
    };

    window.addEventListener("dragstart", handleDragStart);
    window.addEventListener("dragend", handleDragEnd);

    return () => {
      window.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("dragend", handleDragEnd);
    };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-wider mb-1">
          <Sparkles size={14} />
          Workspace
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-sm text-foreground-muted mt-1">
          Manage your tasks and keep track of your progress.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {isDragging ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setIsOver(true);
            }}
            onDragLeave={() => setIsOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsOver(false);
              setIsDragging(false);
              const taskId = e.dataTransfer.getData("text/plain");
              if (taskId) {
                onTaskDelete(taskId);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border-2 border-dashed cursor-pointer select-none transition-all duration-300 ease-out transform ${
              isOver
                ? "bg-destructive border-destructive scale-110 shadow-lg animate-pulse"
                : "bg-destructive/10 border-destructive/40 text-destructive scale-100 opacity-90 hover:opacity-100 animate-in fade-in zoom-in-95 duration-200"
            }`}
          >
            <Trash2 size={16} className={isOver ? "animate-bounce" : ""} />
            <span>Drop to Delete</span>
          </div>
        ) : (
          <button className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-sm text-black hover:text-foreground bg-primary hover:bg-primary-hover active:scale-95 transition-colors duration-200 cursor-pointer">
            <Plus size={16} />
            New Task
          </button>
        )}
        <Link
          href="/trash"
          className="relative group p-2 rounded-xl border border-border hover:border-primary transition-all duration-200"
          title="View Trash"
        >
          {/* Icon */}
          <Trash2
            size={16}
            className="text-foreground-muted group-hover:text-primary transition-colors"
          />

          {/* Badge */}
          {trashCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-destructive text-[9px] font-bold text-white shadow-sm ring-1 ring-background">
              {trashCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}

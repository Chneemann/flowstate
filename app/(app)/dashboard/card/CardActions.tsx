/**
 * @file app/(app)/dashboard/card/CardActions.tsx
 * @description Client component rendering the mobile status transition, edit option, and deletion dropdown for a card.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, CornerDownRight, Trash2, Pencil } from "lucide-react";
import { COLUMNS, TaskStatus } from "@/lib/types/task";

/**
 * Properties for the CardActions component.
 *
 * @interface CardActionsProps
 * @property {string} taskId - The unique identifier of the task.
 * @property {TaskStatus} currentStatus - The current status category of the task.
 * @property {boolean} isCreator - Flag indicating whether the current user is the creator of the task.
 * @property {(newStatus: TaskStatus) => void} onMove - Callback function triggered when a new status column is selected.
 * @property {() => void} onDelete - Callback function triggered when the delete action is selected.
 */
interface CardActionsProps {
  taskId: string;
  currentStatus: TaskStatus;
  isCreator: boolean;
  onMove: (newStatus: TaskStatus) => void;
  onDelete: () => void;
}

/**
 * Renders a mobile-only action menu component allowing users to move a task
 * between different columns, edit it, or delete it entirely via a dropdown interface.
 *
 * @param {CardActionsProps} props - The component props.
 * @returns {JSX.Element} The rendered mobile card actions component.
 */
export default function CardActions({
  taskId,
  currentStatus,
  isCreator,
  onMove,
  onDelete,
}: CardActionsProps) {
  const router = useRouter();
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

  /**
   * Handles clicking an action item to move the task to a target status category.
   *
   * @param {React.MouseEvent} e - The mouse event object.
   * @param {TaskStatus} targetStatus - The target status category to move the task to.
   */
  const handleActionClick = (e: React.MouseEvent, targetStatus: TaskStatus) => {
    e.stopPropagation();
    onMove(targetStatus);
    setShowMobileActions(false);
  };

  /**
   * Handles clicking the edit action item to navigate to the task edit view if a valid ID exists.
   *
   * @param {React.MouseEvent} e - The mouse event object.
   */
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (taskId) {
      router.push(`/tasks?task=edit&id=${taskId}`);
    }
    setShowMobileActions(false);
  };

  /**
   * Handles clicking the delete action item to trigger task deletion.
   *
   * @param {React.MouseEvent} e - The mouse event object.
   */
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    setShowMobileActions(false);
  };

  return (
    <div className="relative sm:hidden" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowMobileActions(!showMobileActions);
        }}
        className="p-1.5 rounded-lg border border-border bg-background/50 text-foreground-muted transition-all cursor-pointer hover:text-foreground hover:border-primary-hover flex items-center justify-center"
        title="Task Actions"
      >
        <MoreHorizontal size={14} />
      </button>

      <div
        className={`absolute right-0 bottom-8 z-50 w-50 bg-card border border-border rounded-xl shadow-2xl p-1.5 space-y-1 text-xs origin-bottom-right transition-all duration-200 ease-out ${
          showMobileActions
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-10 pointer-events-none"
        }`}
      >
        {COLUMNS.map((col) => {
          if (col.id === currentStatus) return null;
          return (
            <button
              key={col.id}
              onClick={(e) => handleActionClick(e, col.id)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-border flex items-center justify-between hover:text-primary group/btn transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2 font-medium">
                <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                {col.title}
              </span>
              <CornerDownRight
                size={12}
                className="text-foreground-muted group-hover/btn:text-primary transition-all"
              />
            </button>
          );
        })}

        {/* Creator Actions: Edit & Delete */}
        {isCreator && (
          <>
            <div className="h-px bg-border my-2" />
            <button
              onClick={handleEditClick}
              disabled={!taskId}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary-hover hover:text-black flex items-center justify-between text-foreground-muted group/edit transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                <Pencil size={12} />
                Edit Task
              </span>
            </button>
            <button
              onClick={handleDeleteClick}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-destructive hover:text-foreground flex items-center justify-between text-destructive group/del transition-colors cursor-pointer font-medium"
            >
              <span className="flex items-center gap-2">
                <Trash2 size={12} />
                Delete Task
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

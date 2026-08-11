/**
 * @file dashboard/header/DeleteDropZone.tsx
 * @description Client component rendering an interactive drop zone for deleting tasks during drag-and-drop.
 */

"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

/**
 * Renders a drop target zone that appears dynamically during drag-and-drop operations,
 * allowing users to delete tasks by dragging them onto the designated area.
 *
 * @param {Object} props - The component props.
 * @param {(taskId: string) => void} props.onTaskDelete - Callback triggered when a task is dropped into the delete zone.
 * @returns {JSX.Element | null} The rendered delete drop zone component, or null if no drag operation is active.
 */
export default function DeleteDropZone({
  onTaskDelete,
}: {
  onTaskDelete: (taskId: string) => void;
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

  if (!isDragging) return null;

  return (
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
        const taskId = e.dataTransfer.getData("text/plain");
        if (taskId) {
          onTaskDelete(taskId);
        }
      }}
      className={`peer flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border-2 border-dashed cursor-pointer select-none transition-all duration-300 ease-out transform ${
        isOver
          ? "bg-destructive border-destructive scale-110 shadow-lg animate-pulse"
          : "bg-destructive/10 border-destructive/40 text-destructive scale-100 opacity-90 hover:opacity-100"
      }`}
    >
      <Trash2 size={16} className={isOver ? "animate-bounce" : ""} />
      <span>Drop to Delete</span>
    </div>
  );
}

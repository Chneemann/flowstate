/**
 * @file dashboard/header/DeleteDropZone.tsx
 * @description Client component rendering an interactive drop zone for deleting tasks during drag-and-drop operations, managing drag state and drop actions.
 */

"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

/**
 * Properties for the DeleteDropZone component.
 *
 * @interface DeleteDropZoneProps
 * @property {(taskId: string) => void} onTaskDelete - Callback triggered when a valid task is dropped onto the delete zone.
 * @property {(isDragging: boolean) => void} onDragStateChange - Callback notified when drag status and permissions change globally.
 */
interface DeleteDropZoneProps {
  onTaskDelete: (taskId: string) => void;
  onDragStateChange: (isDragging: boolean) => void;
}

/**
 * Renders a conditional delete drop zone during active drag events, enabling task deletion
 * when dropped onto the target area if authorized.
 *
 * @param {DeleteDropZoneProps} props - The component props.
 * @returns {JSX.Element | null} The rendered drop zone component or null if no authorized drag is active.
 */
export default function DeleteDropZone({
  onTaskDelete,
  onDragStateChange,
}: DeleteDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const handleDragStart = (e: DragEvent) => {
      const isCreatorString = e.dataTransfer?.getData("isCreator");
      const allowed = isCreatorString === "true";

      if (allowed) {
        setIsDragging(true);
        setIsAllowed(true);
        onDragStateChange(true);
      }
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      setIsAllowed(false);
      setIsOver(false);
      onDragStateChange(false);
    };

    window.addEventListener("dragstart", handleDragStart);
    window.addEventListener("dragend", handleDragEnd);

    return () => {
      window.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("dragend", handleDragEnd);
    };
  }, [onDragStateChange]);

  if (!isDragging || !isAllowed) return null;

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
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border-2 border-dashed cursor-pointer select-none transition-all duration-300 ease-out transform ${
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

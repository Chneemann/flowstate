/**
 * @file app/(app)/dashboard/header/DropZones.tsx
 * @description Client component rendering interactive drop zones for editing and deleting tasks during drag-and-drop operations.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { DropZoneButton } from "./DropZoneButton";

/**
 * Properties for the DropZones component.
 *
 * @interface DropZonesProps
 * @property {(taskId: string) => void} onTaskDelete - Callback function triggered when a task is dropped onto the delete zone.
 * @property {(isDragging: boolean) => void} onDragStateChange - Callback function notifying parent components of global drag state changes.
 */
interface DropZonesProps {
  onTaskDelete: (taskId: string) => void;
  onDragStateChange: (isDragging: boolean) => void;
}

/**
 * Renders drag-and-drop zones (Edit and Delete) that appear when a user initiates a task drag operation.
 *
 * @param {DropZonesProps} props - The component props.
 * @returns {JSX.Element | null} The rendered drop zones container or null when no active drag operation is ongoing.
 */
export default function DropZones({
  onTaskDelete,
  onDragStateChange,
}: DropZonesProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [activeZone, setActiveZone] = useState<"edit" | "delete" | null>(null);

  useEffect(() => {
    /**
     * Handles global dragstart events to detect creator task dragging and reveal drop zones.
     *
     * @param {DragEvent} e - The native DOM drag event object.
     */
    const handleDragStart = (e: DragEvent) => {
      const allowed = e.dataTransfer?.getData("isCreator") === "true";
      if (allowed) {
        setIsDragging(true);
        onDragStateChange(true);
      }
    };

    /**
     * Handles global dragend events to reset active drop zones and state.
     */
    const handleDragEnd = () => {
      setIsDragging(false);
      setActiveZone(null);
      onDragStateChange(false);
    };

    window.addEventListener("dragstart", handleDragStart);
    window.addEventListener("dragend", handleDragEnd);
    return () => {
      window.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("dragend", handleDragEnd);
    };
  }, [onDragStateChange]);

  if (!isDragging) return null;

  return (
    <div className="flex items-center gap-3 animate-in fade-in duration-200">
      {/* Edit Zone */}
      <DropZoneButton
        label="Drop to Edit"
        icon={Pencil}
        variant="primary"
        isOver={activeZone === "edit"}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          setActiveZone("edit");
        }}
        onDragLeave={() => setActiveZone(null)}
        onDrop={(e) => {
          e.preventDefault();
          setActiveZone(null);
          const taskId = e.dataTransfer.getData("text/plain");
          if (taskId) router.push(`/tasks?task=edit&id=${taskId}`);
        }}
      />

      {/* Delete Zone */}
      <DropZoneButton
        label="Drop to Delete"
        icon={Trash2}
        variant="danger"
        isOver={activeZone === "delete"}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          setActiveZone("delete");
        }}
        onDragLeave={() => setActiveZone(null)}
        onDrop={(e) => {
          e.preventDefault();
          setActiveZone(null);
          const taskId = e.dataTransfer.getData("text/plain");
          if (taskId) onTaskDelete(taskId);
        }}
      />
    </div>
  );
}

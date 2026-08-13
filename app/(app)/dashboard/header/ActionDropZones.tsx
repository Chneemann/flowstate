/**
 * @file dashboard/header/ActionDropZones.tsx
 * @description Client component rendering interactive drop zones for editing and deleting tasks during drag-and-drop operations.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, LucideIcon } from "lucide-react";

/**
 * Properties for the ActionDropZones component.
 *
 * @interface ActionDropZonesProps
 * @property {(taskId: string) => void} onTaskDelete - Callback triggered when a task is dropped onto the delete zone.
 * @property {(isDragging: boolean) => void} onDragStateChange - Callback notified when global drag state begins or ends.
 */
interface ActionDropZonesProps {
  onTaskDelete: (taskId: string) => void;
  onDragStateChange: (isDragging: boolean) => void;
}

/**
 * Configuration structure for individual drop zones (edit and delete).
 *
 * @interface ActionDropZoneConfig
 * @property {"edit" | "delete"} id - Unique identifier for the drop zone.
 * @property {string} label - Text description shown inside the drop zone.
 * @property {LucideIcon} icon - Icon component displayed next to the label.
 * @property {boolean} isOver - Flag indicating if a dragged element is currently hovering over the zone.
 * @property {(val: boolean) => void} setIsOver - State updater for the hover flag.
 * @property {(taskId: string) => void} onDropAction - Action executed when a task is dropped onto the zone.
 * @property {string} activeStyle - Tailwind styling applied when hovered.
 * @property {string} inactiveStyle - Tailwind styling applied when idle.
 */
interface ActionDropZoneConfig {
  id: "edit" | "delete";
  label: string;
  icon: LucideIcon;
  isOver: boolean;
  setIsOver: (val: boolean) => void;
  onDropAction: (taskId: string) => void;
  activeStyle: string;
  inactiveStyle: string;
}

/**
 * Renders interactive drop targets for editing or deleting tasks when a drag action starts,
 * conditionally displaying the edit zone only for authorized creators.
 *
 * @param {ActionDropZonesProps} props - The component props.
 * @returns {JSX.Element | null} The rendered drop zones container or null if no drag is active.
 */
export default function ActionDropZones({
  onTaskDelete,
  onDragStateChange,
}: ActionDropZonesProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [, setIsCreator] = useState(false);
  const [isEditOver, setIsEditOver] = useState(false);
  const [isDeleteOver, setIsDeleteOver] = useState(false);

  useEffect(() => {
    /**
     * Handles the global dragstart window event to activate drop zones if authorized.
     *
     * @param {DragEvent} e - The native drag event.
     */
    const handleDragStart = (e: DragEvent) => {
      const allowed = e.dataTransfer?.getData("isCreator") === "true";
      if (allowed) {
        setIsDragging(true);
        setIsCreator(allowed);
        onDragStateChange(true);
      }
    };

    /**
     * Handles the global dragend window event to reset drop zone states.
     */
    const handleDragEnd = () => {
      setIsDragging(false);
      setIsCreator(false);
      setIsEditOver(false);
      setIsDeleteOver(false);
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

  const zones: ActionDropZoneConfig[] = [
    {
      id: "edit" as const,
      label: "Drop to Edit",
      icon: Pencil,
      isOver: isEditOver,
      setIsOver: setIsEditOver,
      onDropAction: (taskId: string) =>
        router.push(`/tasks?task=edit&id=${taskId}`),
      activeStyle:
        "bg-primary text-black border-primary scale-110 shadow-lg animate-pulse",
      inactiveStyle:
        "bg-primary/10 border-primary/40 text-primary scale-100 opacity-90 hover:opacity-100",
    },
    {
      id: "delete" as const,
      label: "Drop to Delete",
      icon: Trash2,
      isOver: isDeleteOver,
      setIsOver: setIsDeleteOver,
      onDropAction: onTaskDelete,
      activeStyle:
        "bg-destructive border-destructive scale-110 shadow-lg animate-pulse",
      inactiveStyle:
        "bg-destructive/10 border-destructive/40 text-destructive scale-100 opacity-90 hover:opacity-100",
    },
  ];

  return (
    <div className="flex items-center gap-3 animate-in fade-in duration-200">
      {zones.map(
        ({
          id,
          label,
          icon: Icon,
          isOver,
          setIsOver,
          onDropAction,
          activeStyle,
          inactiveStyle,
        }) => (
          <div
            key={id}
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
                onDropAction(taskId);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border-2 border-dashed cursor-pointer select-none transition-all duration-300 ease-out transform ${
              isOver ? activeStyle : inactiveStyle
            }`}
          >
            <Icon size={16} className={isOver ? "animate-bounce" : ""} />
            <span>{label}</span>
          </div>
        ),
      )}
    </div>
  );
}

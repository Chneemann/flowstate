/**
 * @file app/(app)/dashboard/header/DropZoneButton.tsx
 * @description Client component rendering an interactive drop zone target button with dynamic visual feedback for drag-and-drop operations.
 */

"use client";

import { LucideIcon } from "lucide-react";

/**
 * Properties for the DropZoneButton component.
 *
 * @interface DropZoneButtonProps
 * @property {string} label - The text label displayed inside the drop zone.
 * @property {LucideIcon} icon - The Lucide icon component to render alongside the label.
 * @property {"primary" | "secondary" | "danger"} [variant="primary"] - Visual style variant of the button.
 * @property {boolean} isOver - Indicates whether a dragged item is currently hovering over the drop zone.
 * @property {(e: React.DragEvent) => void} onDragOver - Callback handler triggered when a drag element moves over the zone.
 * @property {() => void} onDragLeave - Callback handler triggered when a drag element leaves the zone.
 * @property {(e: React.DragEvent) => void} onDrop - Callback handler triggered when an item is dropped onto the zone.
 */
interface DropZoneButtonProps {
  label: string;
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "danger";
  isOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}

/**
 * Renders a drop target button with dynamic hover state animations and variant-based color schemes for drag operations.
 *
 * @param {DropZoneButtonProps} props - The component props.
 * @returns {JSX.Element} The rendered drop zone button component.
 */
export function DropZoneButton({
  label,
  icon: Icon,
  variant = "primary",
  isOver,
  onDragOver,
  onDragLeave,
  onDrop,
}: DropZoneButtonProps) {
  const baseStyles =
    "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border-2 border-dashed cursor-pointer select-none transition-all duration-300 ease-out transform";

  const activeStyles = "scale-110 shadow-lg animate-pulse";
  const inactiveStyles = "scale-100 opacity-90 hover:opacity-100";

  const variants = {
    primary: {
      active: "bg-primary text-black border-primary",
      inactive: "bg-primary/10 border-primary/40 text-primary",
    },
    secondary: {
      active: "bg-card text-foreground border-foreground",
      inactive:
        "bg-card/60 border-foreground-muted/50 text-foreground hover:border-foreground",
    },
    danger: {
      active: "bg-destructive text-destructive-foreground border-destructive",
      inactive: "bg-destructive/10 border-destructive/40 text-destructive",
    },
  };

  const stateStyles = isOver
    ? `${activeStyles} ${variants[variant].active}`
    : `${inactiveStyles} ${variants[variant].inactive}`;

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`${baseStyles} ${stateStyles}`}
    >
      <Icon size={16} className={isOver ? "animate-bounce" : ""} />
      <span>{label}</span>
    </div>
  );
}

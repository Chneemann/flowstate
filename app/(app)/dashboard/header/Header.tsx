/**
 * @file dashboard/header/Header.tsx
 * @description Client component rendering the dashboard top header section, including workspace info, deletion drop zones, task creation buttons, and trash links.
 */

"use client";

import { Sparkles } from "lucide-react";
import DeleteDropZone from "./DeleteDropZone";
import TrashLink from "./TrashLink";
import NewTaskButton from "./NewTaskButton";
import { useState } from "react";

/**
 * Properties for the Header component.
 *
 * @interface HeaderProps
 * @property {(taskId: string) => void} onTaskDelete - Callback function triggered when a task is dropped into the delete zone.
 */
interface HeaderProps {
  onTaskDelete: (taskId: string) => void;
}

/**
 * Renders the dashboard header section featuring title text, a task deletion drop zone,
 * and conditionally displays the new task action button and trash link based on the drag state.
 *
 * @param {HeaderProps} props - The component props.
 * @returns {JSX.Element} The rendered dashboard header component.
 */
export default function Header({ onTaskDelete }: HeaderProps) {
  const [isDraggingActive, setIsDraggingActive] = useState(false);

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
        <DeleteDropZone
          onTaskDelete={onTaskDelete}
          onDragStateChange={setIsDraggingActive}
        />
        {!isDraggingActive && (
          <div className="flex items-center gap-3 animate-in fade-in duration-200">
            <NewTaskButton />
            <TrashLink />
          </div>
        )}
      </div>
    </div>
  );
}

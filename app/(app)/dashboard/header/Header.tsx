/**
 * @file app/(app)/dashboard/header/Header.tsx
 * @description Client component rendering the dashboard top header section, including workspace info, deletion drop zones, task creation buttons, and trash links.
 */

"use client";

import { Plus, Sparkles } from "lucide-react";
import TrashLink from "./TrashLink";
import { useState } from "react";
import DropZones from "./DropZones";
import { ActionButton } from "@/app/components/ui/buttons/ActionButton";

/**
 * Renders the dashboard header section featuring title text, drop zones,
 * and conditionally displays the new task action button and trash link based on the drag state.
 *
 * @param {Object} props - The component props.
 * @param {(taskId: string) => void} props.onTaskDelete - Callback function triggered when a task is dropped into the delete zone.
 * @returns {JSX.Element} The rendered dashboard header component.
 */
export default function Header({
  onTaskDelete,
}: {
  onTaskDelete: (taskId: string) => void;
}) {
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
        <DropZones
          onTaskDelete={onTaskDelete}
          onDragStateChange={setIsDraggingActive}
        />
        {!isDraggingActive && (
          <div className="flex items-center gap-3 animate-in fade-in duration-200">
            <ActionButton href="/tasks?task=new" variant="primary" icon={Plus}>
              New Task
            </ActionButton>
            <TrashLink />
          </div>
        )}
      </div>
    </div>
  );
}

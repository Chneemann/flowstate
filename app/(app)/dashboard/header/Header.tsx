/**
 * @file dashboard/header/Header.tsx
 * @description Client component rendering the dashboard top header section, including workspace info, deletion drop zones, task creation buttons, and trash links.
 */

"use client";

import { Sparkles } from "lucide-react";
import DeleteDropZone from "./DeleteDropZone";
import TrashLink from "./TrashLink";
import NewTaskButton from "./NewTaskButton";

/**
 * Renders the dashboard header section featuring title text, a task deletion drop zone,
 * a new task action button, and a link to the trash bin.
 *
 * @param {HeaderProps} props - The component props.
 * @returns {JSX.Element} The rendered dashboard header component.
 */
export default function Header({
  onTaskDelete,
}: {
  onTaskDelete: (taskId: string) => void;
}) {
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
        <DeleteDropZone onTaskDelete={onTaskDelete} />
        <div className="flex items-center gap-3 peer-not-empty:hidden">
          <NewTaskButton />
          <TrashLink />
        </div>
      </div>
    </div>
  );
}

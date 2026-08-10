/**
 * @file dashboard/components/KanbanBoardHeader.tsx
 * @description Component rendering the top title header and action buttons for the dashboard view.
 */

import { Plus, Sparkles } from "lucide-react";

/**
 * Renders the dashboard header section including title, subtitle, workspace indicator, and action triggers.
 *
 * @returns {JSX.Element} The rendered dashboard header component.
 */
export default function KanbanBoardHeader() {
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
        <button className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-sm text-black hover:text-foreground bg-primary hover:bg-primary-hover active:scale-95 transition-colors duration-200 cursor-pointer">
          <Plus size={16} />
          New Task
        </button>
      </div>
    </div>
  );
}

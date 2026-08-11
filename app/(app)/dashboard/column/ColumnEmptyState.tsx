/**
 * @file dashboard/column/ColumnEmptyState.tsx
 * @description Client component rendering a placeholder card when a specific column contains no tasks.
 */

"use client";

/**
 * Renders a dashed empty state container with placeholder text for empty columns.
 *
 * @returns {JSX.Element} The rendered column empty state component.
 */
export default function ColumnEmptyState() {
  return (
    <div className="h-28 rounded-xl border border-dashed border-border/80 flex flex-col items-center justify-center text-xs text-foreground-muted/60 bg-card/20 gap-1">
      <span>No tasks</span>
    </div>
  );
}

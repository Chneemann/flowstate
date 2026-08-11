/**
 * @file dashboard/column/ColumnHeader.tsx
 * @description Component rendering the column header with title, color indicator, item count, and add button.
 */

"use client";

import { Plus } from "lucide-react";

/**
 * Renders the header section of a column, displaying a color-coded status indicator,
 * the column name, the total task count badge, and a button to add new tasks.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the column.
 * @param {string} [props.color] - Tailwind CSS color class for the status indicator dot.
 * @param {number} props.count - The number of tasks currently inside this column.
 * @returns {JSX.Element} The rendered column header component.
 */
export default function ColumnHeader({
  title,
  color = "bg-primary",
  count,
}: {
  title: string;
  color?: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
      <div className="flex items-center gap-2.5">
        <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${color}`} />
        <h2 className="font-bold text-xs uppercase tracking-wider">{title}</h2>
        <span className="text-xs bg-card text-foreground-muted px-2 py-0.5 rounded-full font-semibold border border-border/60">
          {count}
        </span>
      </div>
      <button className="text-background hover:text-foreground p-1.5 rounded-lg bg-primary hover:bg-primary-hover transition-all duration-200 cursor-pointer shadow-sm active:scale-95">
        <Plus size={14} />
      </button>
    </div>
  );
}

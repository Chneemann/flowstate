/**
 * @file dashboard/column/ColumnHeader.tsx
 * @description Component rendering the column header with title, color indicator, item count, and add button.
 */

"use client";

import { Plus } from "lucide-react";

/**
 * Properties for the ColumnHeader component.
 *
 * @interface ColumnHeaderProps
 * @property {string} title - The title of the column.
 * @property {string} [color] - Tailwind CSS color class for the status indicator dot.
 * @property {number} count - The number of tasks currently inside this column.
 */
interface ColumnHeaderProps {
  title: string;
  color?: string;
  count: number;
}

/**
 * Renders the header section of a column, displaying a color-coded status indicator,
 * the column name, the total task count badge, and a button to add new tasks.
 *
 * @param {ColumnHeaderProps} props - The component props.
 * @returns {JSX.Element} The rendered column header component.
 */
export default function ColumnHeader({
  title,
  color = "bg-primary",
  count,
}: ColumnHeaderProps) {
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

/**
 * @file app/(app)/summary/sections/SummaryStatusCard.tsx
 * @description Client component rendering the workflow status distribution progress breakdown.
 */

"use client";

import { LayoutDashboard } from "lucide-react";
import { COLUMNS } from "@/lib/types/task";

/**
 * Properties for the SummaryStatusCard component.
 *
 * @interface SummaryStatusCardProps
 * @property {number} totalTasks - The total number of tasks across all statuses.
 * @property {Record<string, number>} statusCounts - A record mapping each status identifier to its respective task count.
 */
interface SummaryStatusCardProps {
  totalTasks: number;
  statusCounts: Record<string, number>;
}

/**
 * Renders the workflow status distribution card showing progress bars, percentages,
 * and task counts for each individual pipeline stage.
 *
 * @param {SummaryStatusCardProps} props - The component props.
 * @returns {JSX.Element} The rendered summary status card component.
 */
export default function SummaryStatusCard({
  totalTasks,
  statusCounts,
}: SummaryStatusCardProps) {
  return (
    <div className="lg:col-span-2 bg-card/40 border border-border/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-sm space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight">
            Workflow Status Distribution
          </h3>
          <p className="text-xs text-foreground-muted mt-0.5">
            Task concentration across individual pipeline stages.
          </p>
        </div>
        <div className="bg-primary/10 text-primary p-2 rounded-xl shrink-0">
          <LayoutDashboard size={18} />
        </div>
      </div>

      <div className="space-y-5">
        {COLUMNS.map((col) => {
          const count = statusCounts[col.id] || 0;
          const percentage =
            totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;

          return (
            <div key={col.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5 font-medium">
                  <span
                    className={`w-3 h-3 rounded-full shadow-sm ${col.color}`}
                  />
                  <span>{col.title}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-foreground-muted font-semibold w-10 text-right">
                    {percentage}%
                  </span>
                  <span className="bg-background/80 py-0.5 rounded-lg border border-border/60 text-xs font-bold w-14 text-right inline-block">
                    {count} {count === 1 ? "task" : "tasks"}
                  </span>
                </div>
              </div>

              <div className="w-full bg-background/80 h-2.5 rounded-full overflow-hidden border border-border/40">
                <div
                  className={`h-full transition-all duration-500 ease-out ${col.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

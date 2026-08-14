/**
 * @file app/summary/sections/SummaryPriorityCard.tsx
 * @description Client component rendering the priority severity analysis breakdown.
 */

"use client";

import { Flame } from "lucide-react";
import { PRIORITY_CONFIG } from "@/types/task";

/**
 * Properties for the SummaryPriorityCard component.
 *
 * @interface SummaryPriorityCardProps
 * @property {number} totalTasks - The total number of tasks to calculate percentages against.
 * @property {Record<string, number>} priorityCounts - An object containing counts for each priority level.
 */
interface SummaryPriorityCardProps {
  totalTasks: number;
  priorityCounts: Record<string, number>;
}

/**
 * Renders a priority breakdown card featuring progress bars, count badges,
 * percentage statistics, and severity configuration tags for high, medium, and low tasks.
 *
 * @param {SummaryPriorityCardProps} props - The component props.
 * @returns {JSX.Element} The rendered summary priority card component.
 */
export default function SummaryPriorityCard({
  totalTasks,
  priorityCounts,
}: SummaryPriorityCardProps) {
  return (
    <div className="bg-card/40 border border-border/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight">
            Priority Breakdown
          </h3>
          <p className="text-xs text-foreground-muted mt-0.5">
            Severity and importance weights assigned to active workloads.
          </p>
        </div>
        <div className="bg-accent/10 text-accent p-2 rounded-xl shrink-0">
          <Flame size={18} />
        </div>
      </div>

      <div className="space-y-6 my-auto">
        {(["high", "medium", "low"] as const).map((pKey) => {
          const count = priorityCounts[pKey] || 0;
          const percentage =
            totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
          const config = PRIORITY_CONFIG[pKey];

          return (
            <div key={pKey} className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${config.className}`}
                >
                  {config.label}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-foreground-muted font-semibold w-10 text-right">
                    {percentage}%
                  </span>
                  <span className="bg-background/80 py-0.5 rounded-lg border border-border/60 text-xs font-bold w-14 text-right inline-block">
                    {count} {count === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>

              <div className="w-full bg-background/80 h-2.5 rounded-full overflow-hidden border border-border/40">
                <div
                  className={`h-full transition-all duration-500 ease-out ${
                    pKey === "high"
                      ? "bg-destructive"
                      : pKey === "medium"
                        ? "bg-amber-500"
                        : "bg-primary"
                  }`}
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

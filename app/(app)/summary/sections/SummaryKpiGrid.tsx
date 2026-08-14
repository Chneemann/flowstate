/**
 * @file app/summary/sections/SummaryKpiGrid.tsx
 * @description Client component rendering the primary KPI metrics grid.
 */

"use client";

import { Layers, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

/**
 * Properties for the SummaryKpiGrid component.
 *
 * @interface SummaryKpiGridProps
 * @property {number} totalTasks - The total count of active tasks.
 * @property {number} completionRate - The calculated completion rate percentage.
 * @property {number} overdueTasks - The number of tasks past their deadline.
 * @property {number} upcomingDueTasks - The number of tasks with upcoming deadlines.
 */
interface SummaryKpiGridProps {
  totalTasks: number;
  completionRate: number;
  overdueTasks: number;
  upcomingDueTasks: number;
}

/**
 * Renders a responsive grid of KPI cards summarizing key task metrics,
 * including active totals, completion percentages, overdue items, and upcoming targets.
 *
 * @param {SummaryKpiGridProps} props - The component props.
 * @returns {JSX.Element} The rendered summary KPI grid component.
 */
export default function SummaryKpiGrid({
  totalTasks,
  completionRate,
  overdueTasks,
  upcomingDueTasks,
}: SummaryKpiGridProps) {
  const kpiCards = [
    {
      title: "Active Tasks",
      value: totalTasks,
      icon: Layers,
      color: "text-primary",
      borderColor: "hover:border-primary/40",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: CheckCircle2,
      color: "text-emerald-500",
      borderColor: "hover:border-emerald-500/40",
    },
    {
      title: "Overdue Tasks",
      value: overdueTasks,
      icon: AlertTriangle,
      color: "text-destructive",
      borderColor: "hover:border-destructive/40",
    },
    {
      title: "Upcoming Target",
      value: upcomingDueTasks,
      icon: Clock,
      color: "text-amber-500",
      borderColor: "hover:border-amber-500/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {kpiCards.map(({ title, value, icon: Icon, color, borderColor }) => (
        <div
          key={title}
          className={`bg-card/40 border border-border/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group ${borderColor} transition-all duration-300`}
        >
          <div
            className={`absolute bottom-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity ${color}`}
          >
            <Icon size={48} />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              {title}
            </span>
            <div className={`text-4xl font-black tracking-tight mt-2 ${color}`}>
              {value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * @file app/(app)/summary/page.tsx
 * @description Server component rendering an advanced analytical summary page with comprehensive task metrics.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TaskService } from "@/lib/services/task.service";
import { COLUMNS } from "@/lib/types/task";
import SummaryHeader from "./sections/SummaryHeader";
import SummaryKpiGrid from "./sections/SummaryKpiGrid";
import SummaryStatusCard from "./sections/SummaryStatusCard";
import SummaryPriorityCard from "./sections/SummaryPriorityCard";

/**
 * Calculates comprehensive analytical metrics from the user's active task collection.
 *
 * @param {Array<{ task: any; user: any }>} rawTasks - The collection of raw tasks and user relations.
 * @returns {Object} An object containing total counts, completion rates, overdue totals, and status/priority breakdowns.
 */
function calculateTaskAnalytics(rawTasks: Array<{ task: any; user: any }>) {
  const totalTasks = rawTasks.length;

  const statusCounts: Record<string, number> = COLUMNS.reduce(
    (acc, col) => {
      acc[col.id] = 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  const priorityCounts: Record<string, number> = {
    high: 0,
    medium: 0,
    low: 0,
  };

  let completedTasks = 0;
  let overdueTasks = 0;
  let upcomingDueTasks = 0;

  const now = new Date();

  rawTasks.forEach(({ task }) => {
    if (statusCounts[task.status] !== undefined) statusCounts[task.status]++;
    if (priorityCounts[task.priority] !== undefined)
      priorityCounts[task.priority]++;
    if (task.status === "done") completedTasks++;

    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      if (dueDate < now && task.status !== "done") {
        overdueTasks++;
      } else if (dueDate >= now && task.status !== "done") {
        upcomingDueTasks++;
      }
    }
  });

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalTasks,
    completedTasks,
    completionRate,
    overdueTasks,
    upcomingDueTasks,
    statusCounts,
    priorityCounts,
  };
}

/**
 * Renders the summary analytics page with authentication validation, data retrieval via TaskService,
 * KPI metrics calculation, and structural grid layouts.
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered summary page component.
 */
export default async function SummaryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const rawTasks = await TaskService.findActiveTasksForUser(session.user.id);
  const analytics = calculateTaskAnalytics(rawTasks);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <SummaryHeader />

      <SummaryKpiGrid
        totalTasks={analytics.totalTasks}
        completionRate={analytics.completionRate}
        overdueTasks={analytics.overdueTasks}
        upcomingDueTasks={analytics.upcomingDueTasks}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SummaryStatusCard
          totalTasks={analytics.totalTasks}
          statusCounts={analytics.statusCounts}
        />
        <SummaryPriorityCard
          totalTasks={analytics.totalTasks}
          priorityCounts={analytics.priorityCounts}
        />
      </div>
    </div>
  );
}

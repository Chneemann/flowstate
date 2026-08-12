/**
 * @file dashboard/page.tsx
 * @description Server component rendering the main dashboard page using the TaskService.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Board from "./Board";
import { Task } from "@/types/task";
import { DbUser } from "@/types/user";
import { TaskService } from "@/services/task.service";

/**
 * Renders the dashboard page component with user session validation,
 * optimized database queries for active tasks, and team assignees.
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered dashboard page component.
 */
export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const currentUserId = session.user.id;

  const rawTasksWithCreator =
    await TaskService.findActiveTasksForUser(currentUserId);
  const allTaskIds = rawTasksWithCreator.map((item) => item.task.id);

  const assigneesData = await TaskService.findAssigneesForTasks(allTaskIds);

  const assigneesMap = new Map<string, DbUser[]>();
  for (const row of assigneesData) {
    const existing = assigneesMap.get(row.taskId) || [];
    assigneesMap.set(row.taskId, [...existing, row.user]);
  }

  const tasks: Task[] = rawTasksWithCreator.map(({ task, user }) => ({
    ...task,
    creator: user,
    assignees: assigneesMap.get(task.id) || [],
    isCreator: task.userId === currentUserId,
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <Board tasks={tasks} />
    </div>
  );
}

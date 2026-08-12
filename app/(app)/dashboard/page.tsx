/**
 * @file dashboard/page.tsx
 * @description Server component rendering the main dashboard page, handling authentication, fetching active tasks with assignees and creators, and passing data to the board container.
 */

import { db } from "@/db";
import { taskAssigneesTable, usersTable } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Board from "./Board";
import { Task } from "@/types/tasks";
import { TaskService } from "@/services/task.service";

/**
 * Renders the dashboard page component with user session validation,
 * optimized database queries for active tasks, and team assignees
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered dashboard page component.
 */
export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUserId = session.user.id;

  // All active (not deleted) tasks for which the user is either the creator or the assignee

  const rawTasksWithCreator =
    await TaskService.findActiveTasksForUser(currentUserId);
  const allTaskIds = rawTasksWithCreator.map((item) => item.task.id);

  // Load all assignees for these tasks
  const assigneesData =
    allTaskIds.length > 0
      ? await db
          .select({
            taskId: taskAssigneesTable.taskId,
            email: usersTable.email,
          })
          .from(taskAssigneesTable)
          .innerJoin(usersTable, eq(taskAssigneesTable.userId, usersTable.id))
          .where(inArray(taskAssigneesTable.taskId, allTaskIds))
      : [];

  const assigneesMap = new Map<string, string[]>();
  for (const row of assigneesData) {
    const existing = assigneesMap.get(row.taskId) || [];
    assigneesMap.set(row.taskId, [...existing, row.email]);
  }

  const tasks: Task[] = rawTasksWithCreator.map(({ task, creatorEmail }) => ({
    ...task,
    creator: creatorEmail,
    assignees: assigneesMap.get(task.id) || [],
    isCreator: task.userId === currentUserId,
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <Board tasks={tasks} />
    </div>
  );
}

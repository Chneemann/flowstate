/**
 * @file dashboard/page.tsx
 * @description Server component rendering the main dashboard page, handling authentication, fetching user-related tasks and assignees, and passing them to the board.
 */

import { db } from "@/db";
import { tasksTable, taskAssigneesTable, usersTable } from "@/db/schema";
import { eq, inArray, or } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import KanbanBoard from "./KanbanBoard";
import { Task } from "@/types/tasks";

/**
 * Renders the dashboard page component with user session validation,
 * database queries for relevant tasks and team assignees, and passes the structured dataset to the Kanban board container.
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

  const assignedTaskRows = await db
    .select({ taskId: taskAssigneesTable.taskId })
    .from(taskAssigneesTable)
    .where(eq(taskAssigneesTable.userId, currentUserId));

  const assignedTaskIds = assignedTaskRows.map((r) => r.taskId);

  const taskWhereClause =
    assignedTaskIds.length > 0
      ? or(
          eq(tasksTable.userId, currentUserId),
          inArray(tasksTable.id, assignedTaskIds),
        )
      : eq(tasksTable.userId, currentUserId);

  const rawTasksWithCreator = await db
    .select({
      task: tasksTable,
      creatorEmail: usersTable.email,
    })
    .from(tasksTable)
    .innerJoin(usersTable, eq(tasksTable.userId, usersTable.id))
    .where(taskWhereClause);

  const allTaskIds = rawTasksWithCreator.map((item) => item.task.id);

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
    tags: [],
    commentsCount: 0,
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <KanbanBoard tasks={tasks} />
    </div>
  );
}

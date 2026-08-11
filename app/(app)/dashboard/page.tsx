/**
 * @file dashboard/page.tsx
 * @description Server component rendering the main dashboard page, handling authentication, fetching active user-related tasks and assignees, computing trash counts, and passing data to the kanban board container.
 */

import { db } from "@/db";
import { tasksTable, taskAssigneesTable, usersTable } from "@/db/schema";
import { and, count, eq, inArray, isNotNull, isNull, or } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import KanbanBoard from "./KanbanBoard";
import { Task } from "@/types/tasks";

/**
 * Renders the dashboard page component with user session validation,
 * database queries for active tasks, team assignees, and soft-deleted trash counts,
 * before passing the structured dataset to the Kanban board container.
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

  const taskWhereClause = and(
    isNull(tasksTable.deletedAt),
    assignedTaskIds.length > 0
      ? or(
          eq(tasksTable.userId, currentUserId),
          inArray(tasksTable.id, assignedTaskIds),
        )
      : eq(tasksTable.userId, currentUserId),
  );

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

  const [trashCountResult] = await db
    .select({ count: count() })
    .from(tasksTable)
    .where(
      and(
        eq(tasksTable.userId, currentUserId),
        isNotNull(tasksTable.deletedAt),
      ),
    );

  const trashCount = trashCountResult.count;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <KanbanBoard tasks={tasks} trashCount={trashCount} />
    </div>
  );
}

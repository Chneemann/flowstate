/**
 * @file dashboard/page.tsx
 * @description Server component rendering the main dashboard page, handling authentication, fetching user-related tasks and assignees, and displaying them across kanban columns.
 */

import { db } from "@/db";
import { tasksTable, taskAssigneesTable, usersTable } from "@/db/schema";
import { eq, inArray, or } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import KanbanColumn from "./KanbanColumn";
import { KANBAN_COLUMNS, Task } from "@/types/tasks";

/**
 * Renders the dashboard page layout with user session validation, task queries, assignee mapping,
 * and distributes the tasks into respective kanban columns.
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

  // Determine Assigned Task IDs
  const assignedTaskRows = await db
    .select({ taskId: taskAssigneesTable.taskId })
    .from(taskAssigneesTable)
    .where(eq(taskAssigneesTable.userId, currentUserId));

  const assignedTaskIds = assignedTaskRows.map((r) => r.taskId);

  // Load tasks, including their creators (created by the user OR assigned)
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

  // Load all assignees for the loaded tasks in a batch
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

  // Map for high-performance mapping (taskId -> array of emails)
  const assigneesMap = new Map<string, string[]>();
  for (const row of assigneesData) {
    const existing = assigneesMap.get(row.taskId) || [];
    assigneesMap.set(row.taskId, [...existing, row.email]);
  }

  // Preparing Tasks
  const tasks: Task[] = rawTasksWithCreator.map(({ task, creatorEmail }) => ({
    ...task,
    creator: creatorEmail,
    assignees: assigneesMap.get(task.id) || [],
    tags: [],
    commentsCount: 0,
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {KANBAN_COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              count={columnTasks.length}
              tasks={columnTasks}
              color={col.color}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * @file tasks/page.tsx
 * @description Server component rendering the task creation or edit page with relations.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { usersTable, tasksTable, taskAssigneesTable } from "@/db/schema";
import { redirect } from "next/navigation";
import TaskForm from "./TaskForm";
import { not, eq, isNull, and } from "drizzle-orm";

/**
 * Properties for the TaskPage component.
 *
 * @interface TaskPageProps
 * @property {Promise<{ task?: string; id?: string; }>} searchParams - A promise resolving to the search parameters containing mode and task ID.
 */
interface TaskPageProps {
  searchParams: Promise<{
    task?: string;
    id?: string;
  }>;
}

/**
 * Renders the task creation or edit page, verifying user authentication,
 * fetching existing task data and assignees if in edit mode, loading available users,
 * and passing the context down to the task form component.
 *
 * @async
 * @param {TaskPageProps} props - The component props.
 * @returns {Promise<JSX.Element>} The rendered task page component.
 */
export default async function TaskPage({ searchParams }: TaskPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const mode = params.task;
  const taskId = params.id;

  let initialData = undefined;

  if (mode === "edit" && taskId) {
    const [task] = await db
      .select()
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.id, taskId),
          eq(tasksTable.userId, session.user.id),
          isNull(tasksTable.deletedAt),
        ),
      );

    const assignedRows = await db
      .select({ id: taskAssigneesTable.userId })
      .from(taskAssigneesTable)
      .where(eq(taskAssigneesTable.taskId, taskId));

    initialData = {
      ...task,
      assignees: assignedRows,
    };
  }

  const users = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(not(eq(usersTable.id, session.user.id)));

  return (
    <div className="mx-auto pb-12">
      <TaskForm
        key={`${mode}-${taskId ?? "new"}`}
        users={users}
        initialData={initialData}
        mode={mode}
      />
    </div>
  );
}

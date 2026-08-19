/**
 * @file tasks/page.tsx
 * @description Server component rendering the task creation or edit page with relations.
 */

import { auth } from "@/auth";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { redirect } from "next/navigation";
import TaskForm from "./TaskForm";
import { not, eq } from "drizzle-orm";
import { TaskService } from "@/services/task.service";
import { TaskStatus } from "@/types/task";

/**
 * Properties for the TaskPage component.
 *
 * @interface TaskPageProps
 * @property {Promise<{ task?: string; id?: string; status?: string; }>} searchParams - A promise resolving to the search parameters containing mode, task ID, and status.
 */
interface TaskPageProps {
  searchParams: Promise<{
    task?: string;
    id?: string;
    status?: string;
  }>;
}

/**
 * Renders the task creation or editing page after checking user session authentication,
 * validating edit mode parameters and UUID formats, fetching initial task data and assignable users,
 * and loading the task form component.
 *
 * @async
 * @param {TaskPageProps} props - The component props containing search parameters.
 * @returns {Promise<JSX.Element>} The rendered task page component.
 */
export default async function TaskPage({ searchParams }: TaskPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  let initialData = undefined;

  if (params.task === "edit" && params.id) {
    if (!UUID_REGEX.test(params.id))
      redirect("/dashboard?error=task_not_found");

    initialData = await TaskService.getEditableTask(params.id, session.user.id);

    if (!initialData) redirect("/dashboard?error=unauthorized_edit");
  }

  const users = await db
    .select({ id: usersTable.id, email: usersTable.email })
    .from(usersTable)
    .where(not(eq(usersTable.id, session.user.id)));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <TaskForm
        key={`${params.task}-${params.id ?? "new"}`}
        users={users}
        initialData={initialData}
        mode={params.task}
        defaultStatus={params.status as TaskStatus}
      />
    </div>
  );
}

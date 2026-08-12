/**
 * @file trash/page.tsx
 * @description Server component rendering the trash management view, fetching soft-deleted tasks belonging to the authenticated user.
 */

import { db } from "@/db";
import { Task, tasksTable, usersTable } from "@/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TrashList from "./TrashList";
import TrashHeader from "./components/TrashHeader";

/**
 * Renders the trash page verifying user authentication, querying soft-deleted tasks,
 * and passing them down to the list and header components.
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered trash page component.
 */
export default async function TrashPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const currentUserId = session.user.id;

  const rawTrashedTasks = await db
    .select({
      task: tasksTable,
      creatorEmail: usersTable.email,
    })
    .from(tasksTable)
    .innerJoin(usersTable, eq(tasksTable.userId, usersTable.id))
    .where(
      and(
        eq(tasksTable.userId, currentUserId),
        isNotNull(tasksTable.deletedAt),
      ),
    );

  const tasks: Task[] = rawTrashedTasks.map(({ task }) => ({
    ...task,
    isCreator: task.userId === currentUserId,
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <TrashHeader />
      <TrashList tasks={tasks} />
    </div>
  );
}

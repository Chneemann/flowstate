/**
 * @file trash/page.tsx
 * @description Server component rendering the trash management view using the TaskService.
 */

import { Task } from "@/db/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TrashList from "../trash/TrashList";
import TrashHeader from "../trash/components/TrashHeader";
import { TaskService } from "@/services/task.service";

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

  const rawTrashedTasks =
    await TaskService.findTrashTasksForUser(currentUserId);

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

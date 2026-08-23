/**
 * @file app/(app)/trash/page.tsx
 * @description Server component rendering the trash management view with database search filtering.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TrashList from "../trash/TrashList";
import TrashHeader from "../trash/components/TrashHeader";
import { TaskService } from "@/lib/services/task.service";
import { Task } from "@/lib/types/task";

/**
 * Renders the trash page view, fetching soft-deleted tasks for the authenticated user
 * with optional search query filtering applied at the database level.
 *
 * @async
 * @param {Object} props - The page component props.
 * @param {Promise<{ search?: string }>} props.searchParams - Promise resolving to the route's search query parameters.
 * @returns {Promise<JSX.Element>} The rendered trash page component.
 */
export default async function TrashPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const currentUserId = session.user.id;
  const { search } = await searchParams;
  const searchQuery = search?.trim() || "";

  // The search is passed directly to the SQL query
  const rawTrashedTasks = await TaskService.findTrashTasksForUser(
    currentUserId,
    searchQuery,
  );

  const tasks: Task[] = rawTrashedTasks.map(({ task, user }) => ({
    ...task,
    creator: user,
    assignees: [],
    isCreator: task.userId === currentUserId,
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <TrashHeader />
      <TrashList tasks={tasks} />
    </div>
  );
}

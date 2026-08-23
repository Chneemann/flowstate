/**
 * @file app/(app)/trash/components/TaskActionButton.tsx
 * @description Client component handling task restoration or permanent deletion requests with loading state and router refresh.
 */

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Trash2, Loader2 } from "lucide-react";
import { mutate } from "swr";

/**
 * Properties for the TaskActionButton component.
 *
 * @interface TaskActionButtonProps
 * @property {string} taskId - The unique identifier of the target task.
 * @property {"restore" | "delete"} action - The type of action to execute (restore or delete).
 */
interface TaskActionButtonProps {
  taskId: string;
  action: "restore" | "delete";
}

/**
 * Renders an action button for either restoring or permanently deleting a task,
 * managing the request lifecycle and visual transition states.
 *
 * @param {TaskActionButtonProps} props - The component props.
 * @returns {JSX.Element} The rendered task action button component.
 */
export default function TaskActionButton({
  taskId,
  action,
}: TaskActionButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isRestore = action === "restore";

  /**
   * Executes the API request to either restore or delete the task,
   * handling potential errors and refreshing the router upon success.
   */
  const handleClick = () => {
    startTransition(async () => {
      try {
        const response = await fetch(
          isRestore
            ? `/api/tasks/${taskId}`
            : `/api/tasks/${taskId}?permanent=true`,
          {
            method: isRestore ? "PATCH" : "DELETE",
            headers: isRestore
              ? { "Content-Type": "application/json" }
              : undefined,
            body: isRestore ? JSON.stringify({ restore: true }) : undefined,
          },
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || `Failed to ${action} task`);
        mutate("/api/trash/count");
        router.refresh();
      } catch (error) {
        console.error(`Error during task ${action}:`, error);
      }
    });
  };

  const Icon = isRestore ? RotateCcw : Trash2;

  const styles = isRestore
    ? "bg-primary/10 text-primary hover:bg-primary/20"
    : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20";

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${styles}`}
    >
      {isPending ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <Icon size={12} />
      )}
      {isRestore ? "Restore" : "Delete"}
    </button>
  );
}

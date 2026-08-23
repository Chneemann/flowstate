/**
 * @file app/(app)/dashboard/header/NewTaskButton.tsx
 * @description Client component rendering an interactive trigger button for creating new tasks.
 */

"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Renders a stylized button component with an icon and active state animations to initiate task creation.
 *
 * @returns {JSX.Element} The rendered new task button component.
 */
export default function NewTaskButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/tasks?task=new")}
      className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-sm text-black hover:text-foreground bg-primary hover:bg-primary-hover border border-black hover:border-foreground active:scale-95 transition-colors duration-200 cursor-pointer"
    >
      <Plus size={18} />
      <span>New Task</span>
    </button>
  );
}

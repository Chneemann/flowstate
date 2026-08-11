/**
 * @file dasboard/header/NewTaskButton.tsx
 * @description Client component rendering an interactive trigger button for creating new tasks.
 */

"use client";

import { Plus } from "lucide-react";

/**
 * Renders a stylized button component with an icon and active state animations to initiate task creation.
 *
 * @returns {JSX.Element} The rendered new task button component.
 */
export default function NewTaskButton() {
  return (
    <button className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-sm text-black hover:text-foreground bg-primary hover:bg-primary-hover active:scale-95 transition-colors duration-200 cursor-pointer">
      <Plus size={16} />
      New Task
    </button>
  );
}

/**
 * @file app/(app)/dashboard/card/CardPriority.tsx
 * @description Client component rendering the dynamic priority badge for a card based on configuration.
 */

import { TaskPriority, PRIORITY_CONFIG } from "@/lib/types/task";

/**
 * Renders a styled priority badge for a card.
 *
 * @param {Object} props - The component props.
 * @param {TaskPriority} props.priority - The priority level of the task.
 * @returns {JSX.Element | null} The rendered priority badge component, or null if priority is invalid.
 */
export default function CardPriority({ priority }: { priority: TaskPriority }) {
  if (!priority || !PRIORITY_CONFIG[priority]) return null;

  const { label, className } = PRIORITY_CONFIG[priority];

  return (
    <span
      className={`gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border-2 shrink-0 ${className}`}
    >
      {label}
    </span>
  );
}

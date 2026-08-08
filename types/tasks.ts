/**
 * @file types/tasks.ts
 * @description Type definitions, interfaces, and UI configuration mappings for task management and kanban views.
 */

import { taskStatusEnum, type Task as DbTask } from "@/db/schema";

// ==========================================
// Types
// ==========================================

export type TaskStatus = (typeof taskStatusEnum.enumValues)[number];

// ==========================================
// Interfaces
// ==========================================

export interface Task extends Omit<DbTask, "dueDate"> {
  dueDate?: Date | null;
  assignees?: string[];
  creator?: string;
}

export interface KanbanColumnConfig {
  id: TaskStatus;
  title: string;
  color: string;
}

export interface KanbanColumnProps extends KanbanColumnConfig {
  count: number;
  tasks: Task[];
}

export interface KanbanCardProps {
  task: Task;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

// ==========================================
// UI Configurations
// ==========================================

export const KANBAN_COLUMNS = [
  { id: "todo", title: "To-do", color: "bg-zinc-400" },
  { id: "in_progress", title: "In Progress", color: "bg-indigo-500" },
  { id: "await_feedback", title: "Await Feedback", color: "bg-amber-500" },
  { id: "done", title: "Done", color: "bg-emerald-500" },
] as const satisfies readonly KanbanColumnConfig[];

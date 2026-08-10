/**
 * @file types/tasks.ts
 * @description Type definitions, interfaces, and UI configuration mappings for task management and kanban views.
 */

import {
  taskPriorityEnum,
  taskStatusEnum,
  type Task as DbTask,
} from "@/db/schema";

// ==========================================
// Types
// ==========================================

export type TaskStatus = (typeof taskStatusEnum.enumValues)[number];
export type TaskPriority = (typeof taskPriorityEnum.enumValues)[number];

// ==========================================
// Interfaces
// ==========================================

export interface Task extends Omit<DbTask, "dueDate"> {
  dueDate?: Date | null;
  assignees?: string[];
  creator?: string;
}

export interface RouteContext {
  params: Promise<{ id: string }>;
}

export interface TaskPriorityConfig {
  label: string;
  className: string;
}

export interface KanbanColumnConfig {
  id: TaskStatus;
  title: string;
  color: string;
}

export interface KanbanColumnProps extends KanbanColumnConfig {
  count: number;
  tasks: Task[];
  updatingTaskIds?: Set<string>;
  onTaskMove?: (taskId: string, targetStatus: TaskStatus) => void;
}

export interface KanbanCardProps {
  task: Task;
  isUpdating?: boolean;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

// ==========================================
// UI Configurations
// ==========================================

export const PRIORITY_CONFIG = {
  high: {
    label: "High",
    className: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  low: {
    label: "Low",
    className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  },
} as const satisfies Record<TaskPriority, TaskPriorityConfig>;

export const KANBAN_COLUMNS = [
  { id: "todo", title: "To-do", color: "bg-zinc-400" },
  { id: "in_progress", title: "In Progress", color: "bg-indigo-500" },
  { id: "await_feedback", title: "Await Feedback", color: "bg-amber-500" },
  { id: "done", title: "Done", color: "bg-emerald-500" },
] as const satisfies readonly KanbanColumnConfig[];

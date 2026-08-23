/**
 * @file lib/schemas/task.ts
 * @description Zod validation schema for task creation and modification operations, enforcing constraints on title, description, status, priority, dates, and assignees.
 */

import { z } from "zod";
import { taskStatusEnum, taskPriorityEnum } from "@/db/schema";

/**
 * Zod validation schema for task entities and form submissions.
 */
export const taskSchema = z.object({
  id: z.uuid().optional(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title is too long (max 255 characters)"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description is too long (max 2000 characters)"),
  status: z.enum(taskStatusEnum.enumValues),
  priority: z.enum(taskPriorityEnum.enumValues),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .transform((val) => new Date(val)),
  dueTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  assignees: z.array(z.uuid()).optional(),
});

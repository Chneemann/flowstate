/**
 * @file services/task.service.ts
 * @description Business logic service handling task permissions, database queries, and status updates.
 */

import { db } from "@/db";
import {
  tasksTable,
  taskAssigneesTable,
  type Task as DbTask,
} from "@/db/schema";
import { TaskStatus } from "@/types/tasks";
import { and, eq, or, exists } from "drizzle-orm";

/**
 * Service class for handling task-related operations and database interactions.
 */
export class TaskService {
  /**
   * Verifies whether a user has access to a specific task as either the owner or an assignee.
   *
   * @async
   * @param {string} taskId - The unique identifier of the task.
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<DbTask | undefined>} The task object if access is verified, otherwise undefined.
   */
  static async verifyAccess(
    taskId: string,
    userId: string,
  ): Promise<DbTask | undefined> {
    const [task] = await db
      .select()
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.id, taskId),
          or(
            eq(tasksTable.userId, userId),
            exists(
              db
                .select({ taskId: taskAssigneesTable.taskId })
                .from(taskAssigneesTable)
                .where(
                  and(
                    eq(taskAssigneesTable.taskId, taskId),
                    eq(taskAssigneesTable.userId, userId),
                  ),
                ),
            ),
          ),
        ),
      );

    return task as DbTask | undefined;
  }

  /**
   * Updates a task's status if the user is authorized as either the owner or an assignee.
   *
   * @async
   * @param {string} taskId - The unique identifier of the task to update.
   * @param {string} userId - The unique identifier of the user performing the update.
   * @param {TaskStatus} status - The new status to apply to the task.
   * @returns {Promise<DbTask | null>} The updated task object, or null if the update failed or user is unauthorized.
   */
  static async updateStatusIfAuthorized(
    taskId: string,
    userId: string,
    status: TaskStatus,
  ) {
    const [updatedTask] = await db
      .update(tasksTable)
      .set({
        status: status,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(tasksTable.id, taskId),
          or(
            eq(tasksTable.userId, userId),
            exists(
              db
                .select({ taskId: taskAssigneesTable.taskId })
                .from(taskAssigneesTable)
                .where(
                  and(
                    eq(taskAssigneesTable.taskId, taskId),
                    eq(taskAssigneesTable.userId, userId),
                  ),
                ),
            ),
          ),
        ),
      )
      .returning();

    return (updatedTask as DbTask | undefined) || null;
  }

  /**
   * Deletes a task if the user is authorized as either the owner or an assignee.
   *
   * @async
   * @param {string} taskId - The unique identifier of the task to delete.
   * @param {string} userId - The unique identifier of the user performing the deletion.
   * @returns {Promise<DbTask | null>} The deleted task object, or null if the deletion failed or user is unauthorized.
   */
  static async deleteIfAuthorized(taskId: string, userId: string) {
    const [deletedTask] = await db
      .delete(tasksTable)
      .where(
        and(
          eq(tasksTable.id, taskId),
          or(
            eq(tasksTable.userId, userId),
            exists(
              db
                .select({ taskId: taskAssigneesTable.taskId })
                .from(taskAssigneesTable)
                .where(
                  and(
                    eq(taskAssigneesTable.taskId, taskId),
                    eq(taskAssigneesTable.userId, userId),
                  ),
                ),
            ),
          ),
        ),
      )
      .returning();

    return (deletedTask as DbTask | undefined) || null;
  }
}

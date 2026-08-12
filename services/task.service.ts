/**
 * @file services/task.service.ts
 * @description Business logic service handling task permissions, database queries, status updates, and soft deletions.
 */

import { db } from "@/db";
import {
  tasksTable,
  taskAssigneesTable,
  type Task as DbTask,
  usersTable,
} from "@/db/schema";
import { TaskStatus } from "@/types/tasks";
import { and, eq, or, exists, isNotNull, isNull, inArray } from "drizzle-orm";

/**
 * Service class for handling task-related operations, access control, and database interactions.
 */
export class TaskService {
  /**
   * Helper: Generates the SQL condition to check if a user is either the creator or an assignee of a task.
   *
   * @private
   * @param {string} userId - The unique identifier of the user.
   * @param {any} [taskIdColumn=tasksTable.id] - The task identifier column reference.
   * @returns {import("drizzle-orm").SQL} The constructed SQL condition.
   */
  private static userHasAccessCondition(
    userId: string,
    taskIdColumn = tasksTable.id,
  ) {
    return or(
      eq(tasksTable.userId, userId),
      exists(
        db
          .select({ taskId: taskAssigneesTable.taskId })
          .from(taskAssigneesTable)
          .where(
            and(
              eq(taskAssigneesTable.taskId, taskIdColumn),
              eq(taskAssigneesTable.userId, userId),
            ),
          ),
      ),
    );
  }

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
          this.userHasAccessCondition(userId, tasksTable.id),
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
   * @param {TaskStatus} status - The new task status to set.
   * @returns {Promise<DbTask | null>} The updated task object or null if authorization fails.
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
          this.userHasAccessCondition(userId, tasksTable.id),
        ),
      )
      .returning();

    return (updatedTask as DbTask | undefined) || null;
  }

  /**
   * Retrieves all active (non-deleted) tasks that a user is authorized to see.
   *
   * @async
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<Array<{ task: DbTask; creatorEmail: string }>>} An array of active tasks with their creator emails.
   */
  static async findActiveTasksForUser(userId: string) {
    return await db
      .select({
        task: tasksTable,
        creatorEmail: usersTable.email,
      })
      .from(tasksTable)
      .innerJoin(usersTable, eq(tasksTable.userId, usersTable.id))
      .where(
        and(
          isNull(tasksTable.deletedAt),
          this.userHasAccessCondition(userId, tasksTable.id),
        ),
      );
  }

  /**
   * Retrieves assignee emails for a batch of task identifiers.
   *
   * @async
   * @param {string[]} taskIds - An array of task unique identifiers.
   * @returns {Promise<Array<{ taskId: string; email: string }>>} An array mapping task IDs to assignee emails.
   */
  static async findAssigneesForTasks(taskIds: string[]) {
    if (taskIds.length === 0) return [];

    return await db
      .select({
        taskId: taskAssigneesTable.taskId,
        email: usersTable.email,
      })
      .from(taskAssigneesTable)
      .innerJoin(usersTable, eq(taskAssigneesTable.userId, usersTable.id))
      .where(inArray(taskAssigneesTable.taskId, taskIds));
  }

  /**
   * Retrieves all soft-deleted tasks belonging to the specified user along with creator info.
   *
   * @async
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<Array<{ task: DbTask; creatorEmail: string }>>} An array of soft-deleted tasks in the trash.
   */
  static async findTrashTasksForUser(userId: string) {
    return await db
      .select({
        task: tasksTable,
        creatorEmail: usersTable.email,
      })
      .from(tasksTable)
      .innerJoin(usersTable, eq(tasksTable.userId, usersTable.id))
      .where(
        and(eq(tasksTable.userId, userId), isNotNull(tasksTable.deletedAt)),
      );
  }

  /**
   * Soft-deletes a task by setting its deletion timestamp if the user is the creator.
   *
   * @async
   * @param {string} taskId - The unique identifier of the task.
   * @param {string} userId - The unique identifier of the user (must be creator).
   * @returns {Promise<DbTask | null>} The soft-deleted task object or null if unauthorized.
   */
  static async softDeleteIfAuthorized(taskId: string, userId: string) {
    const [updatedTask] = await db
      .update(tasksTable)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(tasksTable.id, taskId), eq(tasksTable.userId, userId)))
      .returning();

    return (updatedTask as DbTask | undefined) || null;
  }

  /**
   * Permanently deletes a task from the database if it is already soft-deleted and the user is the creator.
   *
   * @async
   * @param {string} taskId - The unique identifier of the task.
   * @param {string} userId - The unique identifier of the user (must be creator).
   * @returns {Promise<DbTask | null>} The permanently deleted task object or null if unauthorized.
   */
  static async permanentlyDeleteIfAuthorized(taskId: string, userId: string) {
    const [deletedTask] = await db
      .delete(tasksTable)
      .where(
        and(
          eq(tasksTable.id, taskId),
          isNotNull(tasksTable.deletedAt),
          eq(tasksTable.userId, userId),
        ),
      )
      .returning();

    return (deletedTask as DbTask | undefined) || null;
  }

  /**
   * Restores a soft-deleted task by clearing its deletion timestamp if the user is the creator.
   *
   * @async
   * @param {string} taskId - The unique identifier of the task.
   * @param {string} userId - The unique identifier of the user (must be creator).
   * @returns {Promise<DbTask | null>} The restored task object or null if unauthorized.
   */
  static async restoreIfAuthorized(taskId: string, userId: string) {
    const [restoredTask] = await db
      .update(tasksTable)
      .set({
        deletedAt: null,
        updatedAt: new Date(),
      })
      .where(and(eq(tasksTable.id, taskId), eq(tasksTable.userId, userId)))
      .returning();

    return (restoredTask as DbTask | undefined) || null;
  }
}

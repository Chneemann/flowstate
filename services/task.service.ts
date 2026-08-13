/**
 * @file services/task.service.ts
 * @description Business logic service handling task permissions, database queries, status updates, and soft deletions.
 */

import { db } from "@/db";
import { tasksTable, taskAssigneesTable, usersTable } from "@/db/schema";
import { DbTask, TaskPayload, TaskStatus } from "@/types/task";
import { and, eq, or, exists, isNotNull, isNull, inArray } from "drizzle-orm";

/**
 * Service class for handling task-related operations, access control, and database interactions.
 */
export class TaskService {
  /**
   * Generates a Drizzle query condition verifying whether a user has access to a task as an owner or an assignee.
   *
   * @private
   * @param {string} userId - The unique identifier of the user.
   * @param {any} [taskIdColumn=tasksTable.id] - The task identifier column to check against.
   * @returns {any} The Drizzle OR condition expression.
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
   * Helper: Synchronizes the assigned users for a specified task within a transaction.
   *
   * @private
   * @async
   * @param {any} tx - The Drizzle transaction instance.
   * @param {string} taskId - The unique identifier of the task.
   * @param {string[]} [assignees] - An optional list of user IDs to assign.
   * @returns {Promise<void>}
   */
  private static async syncAssignees(
    tx: any,
    taskId: string,
    assignees?: string[],
  ) {
    await tx
      .delete(taskAssigneesTable)
      .where(eq(taskAssigneesTable.taskId, taskId));

    if (assignees && assignees.length > 0) {
      const uniqueAssignees = [...new Set(assignees)];
      const values = uniqueAssignees.map((userId) => ({ taskId, userId }));
      await tx.insert(taskAssigneesTable).values(values);
    }
  }

  /**
   * Verifies if a user has access to a specific task by ID.
   *
   * @async
   * @param {string} taskId - The unique identifier of the task.
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<DbTask | undefined>} The task object if authorized, otherwise undefined.
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
   * Updates the status of a task if the user is authorized.
   *
   * @async
   * @param {string} taskId - The unique identifier of the task.
   * @param {string} userId - The unique identifier of the user.
   * @param {TaskStatus} status - The new task status to set.
   * @returns {Promise<DbTask | null>} The updated task object or null if unauthorized.
   */
  static async updateStatusIfAuthorized(
    taskId: string,
    userId: string,
    status: TaskStatus,
  ) {
    const [updatedTask] = await db
      .update(tasksTable)
      .set({ status, updatedAt: new Date() })
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
   * Retrieves all active (non-deleted) tasks for a specific user.
   *
   * @async
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<Array<{ task: DbTask; user: any }>>} An array of tasks joined with their creator users.
   */
  static async findActiveTasksForUser(userId: string) {
    return await db
      .select({ task: tasksTable, user: usersTable })
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
   * Fetches all assignees for a given list of task IDs in a batch query.
   *
   * @async
   * @param {string[]} taskIds - An array of task unique identifiers.
   * @returns {Promise<Array<{ taskId: string; user: any }>>} An array of task assignee and user mapping records.
   */
  static async findAssigneesForTasks(taskIds: string[]) {
    if (taskIds.length === 0) return [];
    return await db
      .select({ taskId: taskAssigneesTable.taskId, user: usersTable })
      .from(taskAssigneesTable)
      .innerJoin(usersTable, eq(taskAssigneesTable.userId, usersTable.id))
      .where(inArray(taskAssigneesTable.taskId, taskIds));
  }

  /**
   * Retrieves all soft-deleted tasks in the trash for a specific user.
   *
   * @async
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<Array<{ task: DbTask; user: any }>>} An array of deleted tasks joined with users.
   */
  static async findTrashTasksForUser(userId: string) {
    return await db
      .select({ task: tasksTable, user: usersTable })
      .from(tasksTable)
      .innerJoin(usersTable, eq(tasksTable.userId, usersTable.id))
      .where(
        and(eq(tasksTable.userId, userId), isNotNull(tasksTable.deletedAt)),
      );
  }

  /**
   * Soft-deletes a task if the user is authorized as the owner.
   *
   * @async
   * @param {string} taskId - The unique identifier of the task.
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<DbTask | null>} The soft-deleted task record or null if unauthorized.
   */
  static async softDeleteIfAuthorized(taskId: string, userId: string) {
    const [updatedTask] = await db
      .update(tasksTable)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(tasksTable.id, taskId), eq(tasksTable.userId, userId)))
      .returning();

    return (updatedTask as DbTask | undefined) || null;
  }

  /**
   * Permanently deletes a task from the database if authorized and already soft-deleted.
   *
   * @async
   * @param {string} taskId - The unique identifier of the task.
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<DbTask | null>} The permanently deleted task record or null if unauthorized.
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
   * Restores a soft-deleted task from the trash if the user is authorized.
   *
   * @async
   * @param {string} taskId - The unique identifier of the task.
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<DbTask | null>} The restored task record or null if unauthorized.
   */
  static async restoreIfAuthorized(taskId: string, userId: string) {
    const [restoredTask] = await db
      .update(tasksTable)
      .set({ deletedAt: null, updatedAt: new Date() })
      .where(and(eq(tasksTable.id, taskId), eq(tasksTable.userId, userId)))
      .returning();

    return (restoredTask as DbTask | undefined) || null;
  }

  /**
   * Creates a new task and synchronizes its assignees within a database transaction.
   *
   * @async
   * @param {string} userId - The unique identifier of the user creating the task.
   * @param {TaskPayload} data - The payload containing task details.
   * @returns {Promise<DbTask>} The newly created task record.
   */
  static async createTask(userId: string, data: TaskPayload) {
    return await db.transaction(async (tx) => {
      const [newTask] = await tx
        .insert(tasksTable)
        .values({
          title: data.title,
          description: data.description ?? "",
          priority: data.priority,
          status: data.status,
          dueDate: new Date(data.dueDate),
          userId,
        })
        .returning();

      await this.syncAssignees(tx, newTask.id, data.assignees);
      return newTask as DbTask;
    });
  }

  /**
   * Updates an existing task and synchronizes its assignees if the user is authorized.
   *
   * @async
   * @param {string} taskId - The unique identifier of the task to update.
   * @param {string} userId - The unique identifier of the user performing the update.
   * @param {TaskPayload} data - The payload containing updated task details.
   * @returns {Promise<DbTask | null>} The updated task record or null if unauthorized/not found.
   */
  static async updateTaskIfAuthorized(
    taskId: string,
    userId: string,
    data: TaskPayload,
  ) {
    return await db.transaction(async (tx) => {
      const [updatedTask] = await tx
        .update(tasksTable)
        .set({
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          dueDate: new Date(data.dueDate),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(tasksTable.id, taskId),
            eq(tasksTable.userId, userId),
            isNull(tasksTable.deletedAt),
          ),
        )
        .returning();

      if (!updatedTask) {
        tx.rollback();
        return null;
      }

      await this.syncAssignees(tx, taskId, data.assignees);
      return updatedTask as DbTask;
    });
  }

  /**
   * Retrieves an editable task along with its assignees if the user owns it and it isn't deleted.
   *
   * @async
   * @param {string} taskId - The unique identifier of the task.
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<any | null>} The task record with assignees or null if not found.
   */
  static async getEditableTask(taskId: string, userId: string) {
    const [task] = await db
      .select()
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.id, taskId),
          eq(tasksTable.userId, userId),
          isNull(tasksTable.deletedAt),
        ),
      );

    if (!task) return null;

    const assignees = await db
      .select({ id: taskAssigneesTable.userId })
      .from(taskAssigneesTable)
      .where(eq(taskAssigneesTable.taskId, taskId));

    return { ...task, assignees };
  }
}

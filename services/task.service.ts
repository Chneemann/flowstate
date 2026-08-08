/**
 * @file services/task.service.ts
 * @description Business logic service handling task permissions and database queries.
 */

import { db } from "@/db";
import {
  tasksTable,
  taskAssigneesTable,
  type Task as DbTask,
} from "@/db/schema";
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
}

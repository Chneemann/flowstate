/**
 * @file services/user.service.ts
 * @description Business logic service handling user-related database queries.
 */

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Service class for handling user operations and database interactions.
 */
export class UserService {
  /**
   * Retrieves specific profile information (firstName, lastName, color, online status) for a user by ID.
   *
   * @async
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<{ firstName: string; lastName: string; color: string; isOnline: boolean; lastLogin: Date } | null>} The user profile data or null.
   */
  static async findProfileById(userId: string) {
    const [user] = await db
      .select({
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        color: usersTable.color,
        isOnline: usersTable.isOnline,
        lastLogin: usersTable.lastLogin,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    return user || null;
  }
}

/**
 * @file services/user.service.ts
 * @description Business logic service handling user-related database queries.
 */

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * Service class for handling user operations and database interactions.
 */
export class UserService {
  /**
   * Retrieves specific profile information for a user by ID.
   *
   * @async
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<{ id: string; firstName: string; lastName: string; email: string; color: string; isOnline: boolean; lastLogin: Date } | null>} The user profile data or null if not found.
   */
  static async findProfileById(userId: string) {
    const [user] = await db
      .select({
        id: usersTable.id,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        email: usersTable.email,
        color: usersTable.color,
        isOnline: usersTable.isOnline,
        lastLogin: usersTable.lastLogin,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    return user || null;
  }

  /**
   * Retrieves a list of all users sorted by their last login date in descending order, placing null values last.
   *
   * @async
   * @returns {Promise<Array<{ id: string; firstName: string; lastName: string; email: string; color: string; lastLogin: Date; isOnline: boolean }>>} An array of user list items.
   */
  static async findAllUsers() {
    return await db
      .select({
        id: usersTable.id,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        email: usersTable.email,
        color: usersTable.color,
        lastLogin: usersTable.lastLogin,
        isOnline: usersTable.isOnline,
      })
      .from(usersTable)
      .orderBy(sql`${usersTable.lastLogin} DESC NULLS LAST`);
  }
}

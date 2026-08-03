/**
 * @file db/schema.ts (oder ähnlich)
 * @description Defines the SQLite database schema for users and exports related TypeScript types using Drizzle ORM.
 */

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Database table definition for application users.
 */
export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Represents a user record selected from the database.
 */
export type User = typeof usersTable.$inferSelect;

/**
 * Represents a new user object required for insertion into the database.
 */
export type NewUser = typeof usersTable.$inferInsert;

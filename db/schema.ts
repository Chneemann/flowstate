/**
 * @file db/schema.ts
 * @description Defines the PostgreSQL database schema for users using UUIDs, timestamps, and Drizzle ORM.
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Database table definition for application users.
 */
export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Represents a user record selected from the database.
 */
export type User = typeof usersTable.$inferSelect;

/**
 * Represents a new user object required for insertion into the database.
 */
export type NewUser = typeof usersTable.$inferInsert;

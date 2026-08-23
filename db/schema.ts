/**
 * @file db/schema.ts
 * @description Defines the PostgreSQL database schema for users, tasks, and task assignees using Drizzle ORM, including custom enums and relations.
 */

import {
  boolean,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ==========================================
// Enums
// ==========================================

/**
 * Enumeration representing the current lifecycle status of a task.
 */
export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "await_feedback",
  "done",
]);

/**
 * Enumeration representing the priority level of a task.
 */
export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
]);

/**
 * Enumeration representing access control roles assigned to application users.
 */
export const userRoleEnum = pgEnum("user_role", ["admin", "member", "guest"]);

// ==========================================
// Tables
// ==========================================

/**
 * Database table definition for application users.
 */
export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  role: userRoleEnum("role").default("member").notNull(),
  color: varchar("color", { length: 50 }).default("bg-indigo-500").notNull(),
  lastLogin: timestamp("last_login"),
  isOnline: boolean("is_online").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Database table definition for application tasks.
 */
export const tasksTable = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 2000 }).notNull(),
  status: taskStatusEnum("status").default("todo").notNull(),
  priority: taskPriorityEnum("priority").default("medium").notNull(),
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

/**
 * Junction table for assigning multiple users to tasks (Many-to-Many).
 */
export const taskAssigneesTable = pgTable(
  "task_assignees",
  {
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasksTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.taskId, t.userId] }),
  }),
);

// ==========================================
// Type Exports
// ==========================================

export type Task = typeof tasksTable.$inferSelect;
export type User = typeof usersTable.$inferSelect;

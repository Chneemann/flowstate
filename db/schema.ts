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

// ==========================================
// Tables
// ==========================================

/**
 * Database table definition for application users.
 */
export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  color: text("color").default("bg-indigo-500").notNull(),
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
  title: text("title").notNull(),
  description: text("description").notNull(),
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

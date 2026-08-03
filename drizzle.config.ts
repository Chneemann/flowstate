/**
 * @file drizzle.config.ts
 * @description Drizzle Kit configuration file specifying schema locations, migration output directories, and database connection credentials for SQLite.
 */

import { defineConfig } from "drizzle-kit";

/**
 * Configuration object for Drizzle Kit CLI commands (migrations, introspection, studio).
 */
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./sqlite.db",
  },
});

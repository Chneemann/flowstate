/**
 * @file db/index.ts (oder ähnlich)
 * @description Initializes the SQLite database connection using better-sqlite3 and sets up the Drizzle ORM instance with the provided schema.
 */

import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database("./sqlite.db");

/**
 * The Drizzle ORM database instance configured for SQLite with type definitions from the schema.
 */
export const db = drizzle(sqlite, { schema });

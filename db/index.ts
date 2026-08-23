/**
 * @file app/db/index.ts
 * @description Initializes the PostgreSQL database connection using postgres-js and configures the Drizzle ORM instance.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });

/**
 * The Drizzle ORM database instance configured for PostgreSQL with type definitions from the schema.
 */
export const db = drizzle(client, { schema });

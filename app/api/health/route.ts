/**
 * @file app/api/health/route.ts
 * @description API route handler performing a database health check by executing a test query and returning the system status.
 */

import { db } from "@/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Handles GET requests to check the health and database connectivity of the application.
 * Executes a lightweight SQL query and returns a JSON response indicating whether the service is healthy or unhealthy.
 *
 * @async
 * @returns {Promise<NextResponse>} A JSON response containing status details, database connectivity state, error messages if applicable, and a timestamp.
 */
export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);

    return NextResponse.json(
      {
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : "Database connection failed",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }
}

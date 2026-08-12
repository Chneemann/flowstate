/**
 * @file app/api/trash/count/route.ts
 * @description API route handler to retrieve the count of soft-deleted tasks for the authenticated user.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { tasksTable } from "@/db/schema";
import { eq, and, isNotNull, count } from "drizzle-orm";

/**
 * Handles GET requests to retrieve the total number of soft-deleted tasks belonging to the authenticated user.
 * Verifies the user session, queries the database for tasks with a non-null deletedAt timestamp, and returns the count.
 *
 * @async
 * @returns {Promise<NextResponse>} A JSON response containing the trash task count or an error message with the appropriate HTTP status code.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [result] = await db
      .select({ count: count() })
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.userId, session.user.id),
          isNotNull(tasksTable.deletedAt),
        ),
      );

    return NextResponse.json({ count: result?.count ?? 0 }, { status: 200 });
  } catch (error) {
    console.error("Error fetching trash count:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * @file app/api/tasks/[id]/route.ts
 * @description API route handler for updating a task's status patch endpoint, ensuring user authorization and valid status transitions.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { taskStatusEnum } from "@/db/schema";
import { TaskService } from "@/services/task.service";
import { RouteContext, TaskStatus } from "@/types/tasks";

/**
 * Handles PATCH requests to update a specific task's status.
 * Verifies user authentication, validates the incoming status against allowed schema values,
 * checks permissions via the task service, and performs the update.
 *
 * @async
 * @param {Request} request - The incoming HTTP request containing the status update payload.
 * @param {RouteContext} context - The route context containing dynamic route parameters.
 * @returns {Promise<NextResponse>} A JSON response indicating success with the updated task or an error message.
 */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await context.params;
    const body = await request.json();
    const { status } = body as { status: unknown };

    // Validate status against enum values using TaskStatus type guard/check
    const validStatuses = taskStatusEnum.enumValues;
    if (
      !status ||
      typeof status !== "string" ||
      !validStatuses.includes(status as TaskStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid or missing status value" },
        { status: 400 },
      );
    }

    const typedStatus = status as TaskStatus;

    // Execute update & verification via Service in a single step
    const updatedTask = await TaskService.updateStatusIfAuthorized(
      taskId,
      session.user.id,
      typedStatus,
    );

    if (!updatedTask) {
      return NextResponse.json(
        { error: "Task not found or access denied" },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { success: true, task: updatedTask },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating task status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

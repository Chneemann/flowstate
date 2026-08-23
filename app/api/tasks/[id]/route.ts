/**
 * @file app/api/tasks/[id]/route.ts
 * @description API route handlers for task mutations (status update, soft delete, restore, and permanent deletion), enforcing authentication and authorization.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { taskStatusEnum } from "@/db/schema";
import { TaskService } from "@/lib/services/task.service";
import { RouteContext, TaskStatus } from "@/lib/types/task";

/**
 * Handles PATCH requests to either update a task's status or restore a soft-deleted task,
 * validating user sessions, request payloads, and authorization permissions.
 *
 * @async
 * @param {Request} request - The incoming HTTP request object.
 * @param {RouteContext} context - The route context containing dynamic route parameters.
 * @returns {Promise<NextResponse>} A JSON response containing the updated/restored task or an error message.
 */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { status, restore } = body as { status?: unknown; restore?: boolean };

    // Restore a task from the Trash
    if (restore === true) {
      const restoredTask = await TaskService.restoreIfAuthorized(
        taskId,
        session.user.id,
      );

      if (!restoredTask) {
        return NextResponse.json(
          { error: "Task not found or access denied" },
          { status: 403 },
        );
      }

      return NextResponse.json(
        { success: true, task: restoredTask },
        { status: 200 },
      );
    }

    // Update Task Status
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
    console.error("Error during PATCH task operation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * Handles DELETE requests to either move a task to trash (Soft Delete)
 * or permanently delete it if it is already in the trash, verifying session authorization.
 *
 * @async
 * @param {Request} request - The incoming HTTP request object containing query parameters.
 * @param {RouteContext} context - The route context containing dynamic route parameters.
 * @returns {Promise<NextResponse>} A JSON response confirming deletion or an error message.
 */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await context.params;
    const url = new URL(request.url);
    const permanent = url.searchParams.get("permanent") === "true";

    // Delete Permanently (only if already in the Recycle Bin)
    if (permanent) {
      const deletedTask = await TaskService.permanentlyDeleteIfAuthorized(
        taskId,
        session.user.id,
      );

      if (!deletedTask) {
        return NextResponse.json(
          { error: "Task not found, access denied, or not in trash" },
          { status: 403 },
        );
      }

      return NextResponse.json(
        { success: true, task: deletedTask },
        { status: 200 },
      );
    }

    // Move to the Recycle Bin (Soft Delete)
    const softDeletedTask = await TaskService.softDeleteIfAuthorized(
      taskId,
      session.user.id,
    );

    if (!softDeletedTask) {
      return NextResponse.json(
        { error: "Task not found or access denied" },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { success: true, task: softDeletedTask },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error during DELETE task operation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

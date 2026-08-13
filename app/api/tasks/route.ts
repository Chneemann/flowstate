/**
 * @file api/tasks/route.ts
 * @description API endpoint for creating and updating task records with strict existence checks.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { TaskService } from "@/services/task.service";
import { TaskPayload } from "@/types/task";

/**
 * Validates the incoming task request by checking user authentication, parsing the JSON payload,
 * and ensuring all required task fields (and optional ID if specified) are present.
 *
 * @async
 * @param {Request} request - The incoming HTTP request.
 * @param {boolean} [requireId=false] - Whether a task ID is mandatory in the payload body.
 * @returns {Promise<{ userId?: string; body?: TaskPayload & { id?: string }; error?: NextResponse }>} Validation results containing user ID, parsed body, or a NextResponse error.
 */
async function validateTaskRequest(request: Request, requireId = false) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: new NextResponse("Unauthorized", { status: 401 }) };
  }

  const body: TaskPayload & { id?: string } = await request.json();

  if (
    (requireId && !body.id) ||
    !body.title ||
    !body.description ||
    !body.dueDate ||
    !body.status ||
    !body.priority
  ) {
    return {
      error: new NextResponse("Missing required task fields", { status: 400 }),
    };
  }

  return { userId: session.user.id, body };
}

/**
 * Handles POST requests to create a new task record.
 * Validates the request data and delegates creation to the task service.
 *
 * @async
 * @param {Request} request - The incoming HTTP request containing task details.
 * @returns {Promise<NextResponse>} A JSON response with the newly created task or an error status.
 */
export async function POST(request: Request) {
  try {
    const { userId, body, error } = await validateTaskRequest(request, false);
    if (error) return error;

    const newTask = await TaskService.createTask(userId!, body!);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * Handles PATCH requests to update an existing task record.
 * Validates user permissions, verifies task existence, and executes authorized updates.
 *
 * @async
 * @param {Request} request - The incoming HTTP request containing updated task fields.
 * @returns {Promise<NextResponse>} A JSON response with the updated task or an error status.
 */
export async function PATCH(request: Request) {
  try {
    const { userId, body, error } = await validateTaskRequest(request, true);
    if (error) return error;

    const existingTask = await TaskService.verifyAccess(body!.id!, userId!);
    if (!existingTask) {
      return new NextResponse(
        "Task not found or you do not have permission to edit it.",
        { status: 404 },
      );
    }

    const updatedTask = await TaskService.updateTaskIfAuthorized(
      body!.id!,
      userId!,
      body!,
    );

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

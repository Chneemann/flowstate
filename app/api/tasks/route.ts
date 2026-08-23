/**
 * @file app/api/tasks/route.ts
 * @description API endpoint for creating and updating task records with strict Zod validation.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { TaskService } from "@/lib/services/task.service";
import { taskSchema } from "@/lib/schemas/task.schema";

/**
 * Validates the incoming task request by checking user authentication, parsing the JSON payload,
 * and running Zod validation against the task schema.
 *
 * @async
 * @param {Request} request - The incoming HTTP request.
 * @param {boolean} [requireId=false] - Whether a task ID is mandatory in the payload body.
 * @returns {Promise<{ userId?: string; body?: any; error?: NextResponse }>} Validation results containing user ID, parsed body, or a NextResponse error.
 */
async function validateTaskRequest(request: Request, requireId = false) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: new NextResponse("Unauthorized", { status: 401 }) };
  }

  const jsonBody = await request.json().catch(() => null);
  if (!jsonBody) {
    return { error: new NextResponse("Invalid JSON payload", { status: 400 }) };
  }

  const validationResult = taskSchema.safeParse(jsonBody);

  if (!validationResult.success) {
    const errorMessage = validationResult.error.issues[0].message;
    return { error: new NextResponse(errorMessage, { status: 400 }) };
  }

  const body = validationResult.data;

  if (requireId && !body.id) {
    return { error: new NextResponse("Missing task ID", { status: 400 }) };
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

    const UUID_REGEX =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (body.id && !UUID_REGEX.test(body.id)) {
      return new NextResponse("Invalid Task ID format", { status: 400 });
    }

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

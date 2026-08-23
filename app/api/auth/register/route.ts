/**
 * @file app/api/auth/register/route.ts
 * @description API route handler for user registration utilizing Zod for validation, bcrypt hashing, and auto sign-in.
 */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AVAILABLE_COLORS } from "@/lib/types/user";
import { registerSchema } from "@/lib/schemas/auth.schema";

/**
 * Handles POST requests to register a new user.
 * Validates request payload via Zod, checks for email uniqueness, hashes the password, creates the user record, and attempts auto sign-in.
 *
 * @async
 * @param {Request} request - The incoming HTTP request containing registration data.
 * @returns {Promise<NextResponse>} A JSON response indicating registration success or an error message.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { message: "Invalid JSON payload" },
        { status: 400 },
      );
    }

    // 1. Validation with Zod (checks types, lengths, email format, and password matching)
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0].message;
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    const {
      firstName,
      lastName,
      email: rawEmail,
      password,
    } = validationResult.data;
    const email = rawEmail.toLowerCase().trim();

    // 2. Check whether the email address already exists
    const existing = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (existing) {
      return NextResponse.json(
        { message: "Mail is already in use" },
        { status: 409 },
      );
    }

    // 3. Select a random profile color
    const randomColor =
      AVAILABLE_COLORS[Math.floor(Math.random() * AVAILABLE_COLORS.length)];

    // 4. Hash the password and store it in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(usersTable).values({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email,
      password: hashedPassword,
      color: randomColor,
    });

    // 5. Automatic Login After Successful Registration
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      return NextResponse.json(
        {
          message:
            "Registration successful, but auto sign-in failed. Please log in manually.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

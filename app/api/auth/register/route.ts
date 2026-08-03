/**
 * @file route.ts
 * @description API route handler for user registration, managing email normalization, credential validation, secure password hashing, and auto sign-in.
 */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

/**
 * Handles POST requests to register a new user.
 * Parses and validates the request body, normalizes the email address, enforces security rules,
 * checks for existing records, stores the hashed password in the database, and attempts an automatic sign-in.
 *
 * @async
 * @param {Request} request - The incoming HTTP request containing the registration data.
 * @returns {Promise<NextResponse>} A JSON response with status details indicating success or failure.
 */
export async function POST(request: Request) {
  try {
    // Parse incoming JSON body safely
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { message: "Invalid JSON payload" },
        { status: 400 },
      );
    }

    const { email: rawEmail, password } = body;

    // Ensure types and presence of required fields
    if (
      !rawEmail ||
      typeof rawEmail !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    // Normalize email (lowercase and trim)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = rawEmail.toLowerCase().trim();

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    // Enforce minimum password length security constraint
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // Check if user with this email already exists
    const existing = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (existing) {
      return NextResponse.json(
        { message: "Mail is already in use" },
        { status: 409 },
      );
    }

    // Hash password securely with bcrypt before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(usersTable).values({ email, password: hashedPassword });

    // Automatically authenticate the user after successful registration
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

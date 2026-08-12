/**
 * @file route.ts
 * @description API route handler for user registration, managing name validation, email normalization, password matching, hashing, and auto sign-in.
 */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AVAILABLE_COLORS } from "@/types/user";

/**
 * Handles POST requests for new user registration.
 * Validates input fields, checks password confirmation, normalizes email, checks for existing users,
 * assigns a random profile color, hashes the password, saves the user to the database, and performs an automatic sign-in.
 *
 * @async
 * @param {Request} request - The incoming HTTP request containing the registration payload in JSON format.
 * @returns {Promise<NextResponse>} A JSON response indicating registration success or an error message with the appropriate HTTP status code.
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

    const {
      firstName,
      lastName,
      email: rawEmail,
      password,
      confirmPassword,
    } = body;

    // Validation of all required fields
    if (
      !firstName ||
      typeof firstName !== "string" ||
      !lastName ||
      typeof lastName !== "string" ||
      !rawEmail ||
      typeof rawEmail !== "string" ||
      !password ||
      typeof password !== "string" ||
      !confirmPassword ||
      typeof confirmPassword !== "string"
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 },
      );
    }

    // Normalize email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = rawEmail.toLowerCase().trim();

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    // Password length check
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // Check existing user
    const existing = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (existing) {
      return NextResponse.json(
        { message: "Mail is already in use" },
        { status: 409 },
      );
    }

    // Select a random default color from the palette
    const randomColor =
      AVAILABLE_COLORS[Math.floor(Math.random() * AVAILABLE_COLORS.length)];

    // Hash password & save user
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(usersTable).values({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email,
      password: hashedPassword,
      color: randomColor,
    });

    // Auto sign-in
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

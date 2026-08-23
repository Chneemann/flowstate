/**
 * @file services/auth.service.ts
 * @description Authentication service providing helper functions for guest credentials, sign-in, and registration.
 */

import { loginSchema, registerSchema } from "@/lib/schemas/auth";
import { signIn } from "next-auth/react";

/**
 * Retrieves configured public guest credentials from environment variables.
 *
 * @async
 * @returns {Promise<{ email?: string; password?: string; error?: string }>} An object containing guest credentials or an error message if unconfigured.
 */
export async function getGuestCredentials() {
  const email = process.env.NEXT_PUBLIC_GUEST_EMAIL;
  const password = process.env.NEXT_PUBLIC_GUEST_PASSWORD;

  if (!email || !password) {
    return { error: "Guest login is not configured on the server." };
  }

  return { email, password };
}

/**
 * Authenticates a user using email and password credentials, performing client-side validation first.
 *
 * @async
 * @param {string} email - The user's email address.
 * @param {string} password - The user's account password.
 * @returns {Promise<{ success?: boolean; error?: string }>} An object indicating sign-in success or an error message.
 */
export async function loginUser(email: string, password: string) {
  const validationResult = loginSchema.safeParse({ email, password });

  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  try {
    const res = await signIn("credentials", {
      email: validationResult.data.email,
      password: validationResult.data.password,
      redirect: false,
    });

    if (res?.error) {
      if (res.error === "CredentialsSignin") {
        return { error: "Incorrect email address or password." };
      }
      return { error: "An unexpected error has occurred." };
    }

    return { success: true };
  } catch (err: any) {
    if (
      err?.message?.includes("fetch") ||
      err?.name === "TypeError" ||
      err?.message?.includes("network")
    ) {
      return { error: "Server error: API endpoint not available" };
    }
    return { error: err?.message || "An unexpected error has occurred." };
  }
}

/**
 * Registers a new user account by validating the form data and submitting it to the backend registration route.
 *
 * @async
 * @param {Record<string, any>} payload - The user registration form payload containing credentials and user details.
 * @returns {Promise<{ success?: boolean; error?: string }>} An object indicating successful registration or an error message.
 */
export async function registerUser(payload: Record<string, any>) {
  const validationResult = registerSchema.safeParse(payload);

  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validationResult.data),
    });

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (jsonErr) {
        return { error: "Server error: Invalid response format" };
      }
    } else {
      throw new Error("Server error: API endpoint not available");
    }

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong.");
    }

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Something went wrong." };
  }
}

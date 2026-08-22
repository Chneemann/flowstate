/**
 * @file services/auth.service.ts
 * @description Authentication service providing helper functions for guest credentials, sign-in, and registration.
 */

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
 * Authenticates a user using credentials via NextAuth.
 *
 * @async
 * @param {string} email - The user's email address.
 * @param {string} password - The user's account password.
 * @returns {Promise<{ success?: boolean; error?: string }>} An object indicating success or describing the authentication error.
 */
export async function loginUser(email: string, password: string) {
  try {
    const res = await signIn("credentials", {
      email,
      password,
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
 * Registers a new user account via the registration API endpoint.
 *
 * @async
 * @param {Record<string, any>} payload - The user registration form payload containing user details and passwords.
 * @returns {Promise<{ success?: boolean; error?: string }>} An object indicating success or describing the registration error.
 */
export async function registerUser(payload: Record<string, any>) {
  if (payload.password !== payload.confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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

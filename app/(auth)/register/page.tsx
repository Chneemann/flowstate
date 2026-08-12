/**
 * @file RegisterPage.tsx
 * @description Client component providing a user registration interface for creating a new account.
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Renders the registration page featuring a sign-up form, error feedback,
 * and routing logic to the login page upon successful account creation.
 *
 * @returns {JSX.Element} The rendered registration page component.
 */
export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Handles the submission of the registration form, sends user data to the API,
   * creates the account, auto-logins the user, and redirects to the main view on success.
   *
   * @async
   * @param {React.SubmitEvent<HTMLFormElement>} event - The form submission event.
   * @returns {Promise<void>}
   */
  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Send registration request to the API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        }),
      });

      // Ensure the response is valid JSON before parsing
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Server error: API endpoint not available");
      }

      // Handle non-successful status codes
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      // Redirect user
      router.push("/summary");
      return;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      {/* Login Card Container */}
      <div className="w-full max-w-sm p-6 space-y-6 border border-border rounded-xl bg-card backdrop-blur-md">
        {/* Header Section */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Create an Account
          </h1>
          <p className="text-sm text-foreground-muted">
            Get started with your Flowstate Workspace.
          </p>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div
            className="p-3 text-xs font-medium text-destructive bg-destructive-bg border border-destructive-border rounded-lg text-center"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <input
              name="firstName"
              type="text"
              placeholder="First Name*"
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-foreground"
            />
            <input
              name="lastName"
              type="text"
              placeholder="Last Name*"
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-foreground"
            />
          </div>
          <input
            name="email"
            type="email"
            placeholder="Email*"
            required
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-foreground"
          />
          <input
            name="password"
            type="password"
            placeholder="Password*"
            required
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-foreground"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password*"
            required
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-foreground"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-70 transition-opacity disabled:opacity-20 cursor-pointer disabled:cursor-auto"
          >
            {loading ? "Being created..." : "Sign Up"}
          </button>
        </form>

        {/* Back Link Footer */}
        <div className="text-center text-xs text-foreground-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * @file app/(auth)/register/page.tsx
 * @description Client component providing a user registration interface utilizing the auth service.
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/services/auth.service";

/**
 * Renders the registration page featuring a sign-up form, error feedback,
 * and routing logic to the summary view upon successful account creation.
 *
 * @returns {JSX.Element} The rendered registration page component.
 */
export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Handles user registration form submission, validates form data via auth service,
   * and navigates to summary page on successful registration.
   *
   * @async
   * @param {React.SubmitEvent<HTMLFormElement>} event - The form submission event.
   */
  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const result = await registerUser(payload);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/summary");
    }
  }

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div className="w-full max-w-sm p-6 space-y-6 border border-border rounded-xl bg-card backdrop-blur-md">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Create an Account
          </h1>
          <p className="text-sm text-foreground-muted">
            Get started with your Flowstate Workspace.
          </p>
        </div>

        {error && (
          <div
            className="p-3 text-xs font-medium text-destructive bg-destructive-bg border border-destructive-border rounded-lg text-center"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <input
              name="firstName"
              type="text"
              placeholder="First Name*"
              maxLength={50}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-foreground"
            />
            <input
              name="lastName"
              type="text"
              placeholder="Last Name*"
              maxLength={50}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-foreground"
            />
          </div>
          <input
            name="email"
            type="email"
            placeholder="Email*"
            maxLength={255}
            required
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-foreground"
          />
          <input
            name="password"
            type="password"
            placeholder="Password*"
            maxLength={72}
            required
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-foreground"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password*"
            maxLength={72}
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

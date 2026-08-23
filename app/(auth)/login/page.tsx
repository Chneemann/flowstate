/**
 * @file (auth)/login/page.tsx
 * @description Client component providing a user login interface utilizing the auth service.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAsGuest, loginUser } from "@/services/auth.service";

/**
 * Renders the login page containing the authentication form, error handling,
 * and navigation links for user sign-in.
 *
 * @returns {JSX.Element} The rendered login page component.
 */
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loadingType, setLoadingType] = useState<
    "credentials" | "guest" | null
  >(null);

  /**
   * Performs user authentication via email and password using the auth service.
   * Redirects to the summary page upon success or sets an error message on failure.
   *
   * @async
   * @param {string} email - The email address for login.
   * @param {string} password - The account password.
   * @param {"credentials" | "guest"} type - The authentication trigger source type.
   */
  const handleSignIn = async (
    email: string,
    password: string,
    type: "credentials" | "guest",
  ) => {
    setError(null);
    setLoadingType(type);

    const result = await loginUser(email, password);

    if (result.error) {
      setError(result.error);
      setLoadingType(null);
    } else {
      router.push("/summary");
    }
  };

  /**
   * Handles traditional credential-based form submissions.
   *
   * @async
   * @param {React.SubmitEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await handleSignIn(email, password, "credentials");
  };

  /**
   * Triggers secure guest authentication via the backend service.
   *
   * @async
   */
  const handleGuestLogin = async () => {
    setError(null);
    setLoadingType("guest");

    const result = await loginAsGuest();

    if (result.error) {
      setError(result.error);
      setLoadingType(null);
      return;
    }

    router.push("/summary");
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div className="w-full max-w-sm p-6 space-y-4 border border-border rounded-xl bg-card backdrop-blur-md">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Flowstate Login</h1>
          <p className="text-sm text-foreground-muted">Sign in to continue.</p>
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
          <label className="block space-y-2">
            <span className="text-xs font-medium text-foreground-muted">
              E-Mail
            </span>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              maxLength={255}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-foreground"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-medium text-foreground-muted">
              Passwort
            </span>
            <input
              name="password"
              type="password"
              placeholder="•••••••••••••"
              maxLength={72}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-foreground"
            />
          </label>

          <button
            type="submit"
            disabled={loadingType !== null}
            className="w-full py-2 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-70 transition-opacity disabled:opacity-20 cursor-pointer disabled:cursor-auto"
          >
            {loadingType === "credentials" ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="relative flex items-center">
          <div className="grow border-t border-border"></div>
          <span className="shrink mx-4 text-xs text-foreground-muted uppercase">
            or
          </span>
          <div className="grow border-t border-border"></div>
        </div>

        <button
          type="button"
          disabled={loadingType !== null}
          onClick={handleGuestLogin}
          className="w-full py-2 text-sm font-medium rounded-lg bg-background hover:opacity-70 transition-opacity disabled:opacity-20 cursor-pointer disabled:cursor-auto border border-border"
        >
          {loadingType === "guest"
            ? "Signing in as Guest..."
            : "Sign in as Guest"}
        </button>

        <div className="text-center text-xs text-foreground-muted">
          Don't have an account yet?{" "}
          <Link href="/register/" className="text-foreground hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

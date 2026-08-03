/**
 * @file LoginPage.tsx
 * @description Client component providing a user login interface with NextAuth credentials authentication.
 */

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * Renders the login page containing the authentication form, error handling,
 * and navigation links for user sign-in.
 *
 * @returns {JSX.Element} The rendered login page component.
 */
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handles the submission of the login form, validates credentials via NextAuth,
   * and manages loading/error states or redirects upon success.
   *
   * @async
   * @param {React.SubmitEvent<HTMLFormElement>} e - The form submission event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const defaultErrorMessage = "An unexpected error has occurred.";

    try {
      // Attempt to sign in using Auth.js credentials provider
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        // Handle specific authentication errors
        if (res.error === "CredentialsSignin") {
          setError("Incorrect email address or password.");
        } else {
          setError(defaultErrorMessage);
        }
      } else {
        // Redirect user and refresh router cache on success
        router.push("/");
        router.refresh();
        return;
      }
    } catch (err: any) {
      // Handle network or connection errors vs unexpected errors
      if (err?.message?.includes("fetch") || err?.name === "TypeError") {
        setError("Server error: API endpoint not available");
      } else {
        setError(defaultErrorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      {/* Login Card Container */}
      <div className="w-full max-w-sm p-6 space-y-6 border border-border rounded-xl bg-card backdrop-blur-md">
        {/* Header Section */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Flowstate Login</h1>
          <p className="text-sm text-muted">Sign in to continue.</p>
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
          <label className="block space-y-2">
            <span className="text-xs font-medium text-muted">E-Mail</span>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              defaultValue="test@flowstate.io"
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-foreground"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-medium text-muted">Passwort</span>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              defaultValue="password"
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-foreground"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-70 transition-opacity disabled:opacity-20 cursor-pointer disabled:cursor-auto"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        {/* Registration Link Footer */}
        <div className="text-center text-xs text-muted">
          Don't have an account yet?{" "}
          <Link href="/register/" className="text-foreground hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

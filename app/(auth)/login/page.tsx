/**
 * @file (auth)/login/page.tsx
 * @description Client component providing a user login interface with NextAuth credentials authentication and guest login capabilities.
 */

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getGuestCredentials } from "@/services/auth.service";

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
   * Universal sign-in handler for both manual credentials and guest login.
   *
   * @async
   * @param {string} email - The user email.
   * @param {string} password - The user password.
   * @param {"credentials" | "guest"} type - The login method type for specific loading states.
   * @returns {Promise<void>}
   */
  const handleSignIn = async (
    email: string,
    password: string,
    type: "credentials" | "guest",
  ) => {
    setError(null);
    setLoadingType(type);

    const defaultErrorMessage = "An unexpected error has occurred.";

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          setError("Incorrect email address or password.");
        } else {
          setError(defaultErrorMessage);
        }
      } else {
        router.push("/summary");
        return;
      }
    } catch (err: any) {
      if (err?.message?.includes("fetch") || err?.name === "TypeError") {
        setError("Server error: API endpoint not available");
      } else {
        setError(defaultErrorMessage);
      }
    } finally {
      setLoadingType(null);
    }
  };

  /**
   * Handles regular form submission.
   *
   * @async
   * @param {React.SubmitEvent<HTMLFormElement>} e - The form submission event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await handleSignIn(email, password, "credentials");
  };

  /**
   * Handles quick guest login securely via Server Action.
   *
   * @async
   * @returns {Promise<void>}
   */
  const handleGuestLogin = async () => {
    setError(null);
    setLoadingType("guest");

    try {
      const result = await getGuestCredentials();

      if ("error" in result && result.error) {
        setError(result.error);
        setLoadingType(null);
        return;
      }

      if (!result.email || !result.password) {
        setError("Guest login is not configured properly.");
        setLoadingType(null);
        return;
      }

      await handleSignIn(result.email, result.password, "guest");
    } catch (err) {
      setError("Failed to initialize guest login.");
      setLoadingType(null);
    }
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      {/* Login Card Container */}
      <div className="w-full max-w-sm p-6 space-y-4 border border-border rounded-xl bg-card backdrop-blur-md">
        {/* Header Section */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Flowstate Login</h1>
          <p className="text-sm text-foreground-muted">Sign in to continue.</p>
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
            <span className="text-xs font-medium text-foreground-muted">
              E-Mail
            </span>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
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

        {/* Divider */}
        <div className="relative flex items-center">
          <div className="grow border-t border-border"></div>
          <span className="shrink mx-4 text-xs text-foreground-muted uppercase">
            or
          </span>
          <div className="grow border-t border-border"></div>
        </div>

        {/* Guest Login Button */}
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

        {/* Registration Link Footer */}
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

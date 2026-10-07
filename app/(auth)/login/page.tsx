/**
 * @file app/(auth)/login/page.tsx
 * @description Client component providing a user login interface utilizing the auth service.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAsGuest, loginUser } from "@/lib/services/auth.service";
import { Loader2, UserCheck, KeyRound } from "lucide-react";

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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <div className="relative min-h-dvh w-full flex flex-col items-center justify-center p-4 overflow-x-hidden bg-background text-foreground selection:bg-primary selection:text-background">
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-20 sm:-top-32 -z-10 transform-gpu overflow-hidden blur-2xl sm:blur-3xl"
      >
        <div
          className="relative left-[calc(50%-10rem)] aspect-1155/678 w-[20rem] sm:w-50rem -translate-x-1/2 rotate-30deg bg-linear-to-tr from-accent to-primary opacity-20 sm:opacity-15"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      {/* Login Card Container */}
      <div className="w-full max-w-sm p-6 sm:p-8 space-y-6 border border-border rounded-2xl bg-card/80 backdrop-blur-md shadow-xl">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Sign in to{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Flowstate
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Enter your credentials to access your workspace.
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
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-foreground-muted"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              maxLength={255}
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-background/50 text-foreground placeholder:text-foreground-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-foreground-muted"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••••••"
              maxLength={72}
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-background/50 text-foreground placeholder:text-foreground-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loadingType !== null}
            className="w-full py-2.5 px-4 text-sm font-semibold rounded-lg bg-primary text-background shadow-md hover:bg-primary-hover transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {loadingType === "credentials" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center">
          <div className="grow border-t border-border"></div>
          <span className="shrink mx-3 text-[10px] font-semibold tracking-wider text-foreground-muted uppercase">
            or
          </span>
          <div className="grow border-t border-border"></div>
        </div>

        <button
          type="button"
          disabled={loadingType !== null}
          onClick={handleGuestLogin}
          className="w-full py-2.5 px-4 text-sm font-semibold rounded-lg border border-border bg-background/50 hover:bg-border/40 text-foreground transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {loadingType === "guest" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in as Guest...
            </>
          ) : (
            <>
              <UserCheck className="w-4 h-4" />
              Sign in as Guest
            </>
          )}
        </button>

        <div className="text-center text-xs text-foreground-muted pt-1">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground hover:text-primary transition-colors hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

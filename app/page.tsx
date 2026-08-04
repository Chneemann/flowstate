/**
 * @file page.tsx
 * @description Server component acting as the welcome landing page, redirecting authenticated users to the summary view or presenting sign-in and register options.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

/**
 * Renders the welcome landing page. Checks for an active session and redirects
 * if logged in; otherwise, provides navigation links to sign in or register.
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered welcome page component.
 */
export default async function WelcomePage() {
  const session = typeof auth === "function" ? await auth() : null;
  if (session) {
    redirect("/summary");
  }

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Flowstate</h1>
        <p className="text-foreground-muted">Welcome Page</p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login/"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-70 transition-opacity"
          >
            Sign In
          </Link>

          {/* TODO */}
          <Link
            href="/register/"
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border hover:opacity-70 transition-opacity"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

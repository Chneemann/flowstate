/**
 * @file app/(auth)/register/page.tsx
 * @description Client component providing a user registration interface utilizing the auth service.
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/services/auth.service";
import { ActionButton } from "@/app/components/ui/buttons/ActionButton";
import { Loader2, UserPlus } from "lucide-react";
import { JSX } from "react/jsx-runtime";

/**
 * Renders the registration page featuring a sign-up form, error feedback,
 * and routing logic to the summary view upon successful account creation.
 *
 * @returns {JSX.Element} The rendered registration page component.
 */
export default function RegisterPage(): JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Handles user registration form submission, validates form data via auth service,
   * and navigates to summary page on successful registration.
   *
   * @async
   * @function handleSubmit
   * @param {React.SubmitEvent<HTMLFormElement>} event - The form submission event.
   * @returns {Promise<void>} Resolves when registration handling completes.
   */
  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
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

      {/* Registration Card Container */}
      <div className="w-full max-w-sm p-6 sm:p-8 space-y-6 border border-border rounded-2xl bg-card/80 backdrop-blur-md shadow-xl">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Get started with your{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text font-semibold text-transparent">
              Flowstate
            </span>{" "}
            workspace.
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
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label
                htmlFor="firstName"
                className="block text-xs font-medium text-foreground-muted"
              >
                First Name*
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                maxLength={50}
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-background/50 text-foreground placeholder:text-foreground-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="lastName"
                className="block text-xs font-medium text-foreground-muted"
              >
                Last Name*
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                maxLength={50}
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-background/50 text-foreground placeholder:text-foreground-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-foreground-muted"
            >
              Email Address*
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

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-foreground-muted"
            >
              Password*
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

          <div className="space-y-1">
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-medium text-foreground-muted"
            >
              Confirm Password*
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••••••"
              maxLength={72}
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-background/50 text-foreground placeholder:text-foreground-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <ActionButton
            type="submit"
            variant="primary"
            disabled={loading}
            icon={loading ? Loader2 : UserPlus}
            className="w-full sm:w-full"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </ActionButton>
        </form>

        <div className="text-center text-xs text-foreground-muted pt-1">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:text-primary transition-colors hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * @file app/(app)/error.tsx
 * @description Client-side error boundary component that renders an error fallback UI with recovery and navigation actions.
 */

"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

/**
 * Properties for the ErrorBoundary component.
 *
 * @interface ErrorBoundaryProps
 * @property {Error & { digest?: string }} error - The error object caught by the Next.js error boundary.
 * @property {() => void} reset - Function to reset the error boundary and attempt to re-render the segment.
 */
interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Renders an error boundary fallback UI displaying error details, a retry button, and navigation back to the summary page.
 *
 * @param {ErrorBoundaryProps} props - The component props.
 * @returns {JSX.Element} The rendered error boundary fallback component.
 */
export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center my-auto">
      <div className="max-w-md w-full space-y-6">
        {/* Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive-bg border border-destructive-border flex items-center justify-center text-destructive shadow-sm">
          <AlertTriangle size={36} />
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Something went wrong!
          </h1>
          <p className="text-sm text-foreground-muted leading-relaxed">
            An unexpected error occurred while processing your request. You can
            try reloading this section or head back to your summary.
          </p>
          {error?.message && (
            <div className="mt-4 p-3 rounded-lg bg-card border border-border text-xs text-foreground-muted font-mono text-center w-full max-w-sm mx-auto overflow-x-auto max-h-24">
              {error.message}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Try Again Button */}
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-black font-medium hover:bg-primary-hover transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw size={16} />
            Try again
          </button>

          {/* Back to Summary Link */}
          <Link
            href="/summary"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-card border border-border text-white font-medium hover:bg-card/80 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Summary
          </Link>
        </div>
      </div>
    </div>
  );
}

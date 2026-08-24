/**
 * @file app/(app)/not-found.tsx
 * @description Server component rendering a custom 404 page for missing or invalid routes within the app layout.
 */

import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

/**
 * Renders the 404 Not Found fallback view containing an alert icon, message, and navigation link back to the summary page.
 *
 * @returns {JSX.Element} The rendered not found page component.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center my-auto">
      <div className="max-w-md w-full space-y-6">
        {/* Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive-bg border border-destructive-border flex items-center justify-center text-destructive shadow-sm">
          <AlertCircle size={36} />
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Page not found
          </h1>
          <p className="text-sm text-foreground-muted leading-relaxed">
            The page you are looking for doesn't exist or has been moved. Please
            check the URL or head back to your summary.
          </p>
        </div>

        {/* Action Button */}
        <div>
          <Link
            href="/summary"
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-destructive text-white font-medium hover:bg-destructive/80 transition-colors shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to Summary
          </Link>
        </div>
      </div>
    </div>
  );
}

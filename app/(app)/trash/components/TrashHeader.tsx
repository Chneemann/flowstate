/**
 * @file trash/components/TrashHeader.tsx
 * @description Client component rendering the header section for the trash view, including an icon, title, description, and navigation back to the dashboard.
 */

"use client";

import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

/**
 * Renders the trash page header featuring title details, an indicator icon,
 * and a link to navigate back to the main dashboard.
 *
 * @returns {JSX.Element} The rendered trash header component.
 */
export default function TrashHeader() {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
          <Trash2 size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Trash</h1>
          <p className="text-sm text-foreground-muted">
            Tasks removed from your board.
          </p>
        </div>
      </div>

      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary-hover transition-colors mb-6 group"
      >
        <ArrowLeft
          size={14}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Dashboard
      </Link>
    </>
  );
}

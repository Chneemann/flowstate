/**
 * @file app/(app)/summary/sections/SummaryHeader.tsx
 * @description Client component rendering the analytical page header.
 */

"use client";

import { BarChart3 } from "lucide-react";

/**
 * Renders the analytical executive summary header featuring an analytics icon,
 * workspace indicator, main title, and descriptive subtitle.
 *
 * @returns {JSX.Element} The rendered summary header component.
 */
export default function SummaryHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-wider mb-1">
          <BarChart3 size={14} />
          Analytics & Insights
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Executive Summary
        </h1>
        <p className="text-sm text-foreground-muted mt-1">
          Real-time overview of your workspace productivity and workflow
          metrics.
        </p>
      </div>
    </div>
  );
}

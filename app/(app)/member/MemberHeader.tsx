/**
 * @file member/MemberHeader.tsx
 * @description Client component rendering the header section for the team members page.
 */

"use client";

import { UsersRound } from "lucide-react";

/**
 * Renders the members page header featuring title details, workspace subtitle, and an indicator icon.
 *
 * @returns {JSX.Element} The rendered members header component.
 */
export default function MemberHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-wider mb-1">
          <UsersRound size={14} />
          Team
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Member</h1>
        <p className="text-sm text-foreground-muted mt-1">
          Manage your team members and collaborate efficiently.
        </p>
      </div>
    </div>
  );
}

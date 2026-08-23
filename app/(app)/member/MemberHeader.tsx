/**
 * @file app/(app)/member/MemberHeader.tsx
 * @description Client component rendering the header section for the team members page.
 */

"use client";

import { GoBackButton } from "@/app/components/ui/buttons/GoBackButton";
import { UsersRound } from "lucide-react";
import { usePathname } from "next/navigation";

/**
 * Renders the members page header featuring title details, workspace subtitle, and an indicator icon.
 *
 * @returns {JSX.Element} The rendered members header component.
 */
export default function MemberHeader() {
  const pathname = usePathname();
  const isRootPage = pathname === "/member";

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
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

      {!isRootPage && (
        <GoBackButton fallbackUrl="/member" label="Member List" />
      )}
    </>
  );
}

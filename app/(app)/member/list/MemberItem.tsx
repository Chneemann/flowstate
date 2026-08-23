/**
 * @file app/(app)/member/list/MemberItem.tsx
 * @description Client component rendering an individual member item card displaying avatar initials, full name, role badge, email address, online status indicator, and last active timestamp.
 */

"use client";

import {
  getFullName,
  getInitials,
  getStatusColor,
  formatTimeAgo,
  capitalize,
} from "@/lib/utils/user";
import { Mail } from "lucide-react";
import { UserListItem } from "@/lib/types/user";
import Link from "next/link";

/**
 * Properties for the MemberItem component.
 *
 * @interface MemberItemProps
 * @property {UserListItem} member - The member user object containing profile and status information.
 */
interface MemberItemProps {
  member: UserListItem;
}

/**
 * Renders a member list item displaying user credentials, email, dynamic color accent stripe based on online state, and activity status.
 *
 * @param {MemberItemProps} props - The component props.
 * @returns {JSX.Element} The rendered member item component.
 */
export default function MemberItem({ member }: MemberItemProps) {
  return (
    <Link
      href={`/member/${member.id}`}
      className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-card/40 border border-border/80 rounded-2xl hover:border-primary/40 hover:bg-card/70 transition-all duration-200 shadow-sm overflow-hidden"
    >
      {/* Dynamic colored accent stripe */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${
          member.isOnline
            ? "bg-emerald-500/60 group-hover:bg-emerald-500"
            : "bg-slate-600/60 group-hover:bg-slate-500"
        }`}
      />

      {/* --- Left Side --- */}
      <div className="flex items-center gap-3.5">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black tracking-wider text-white shadow-md border-2 border-card ring-2 ring-border/50 ${member.color}`}
          style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)" }}
        >
          {getInitials(member.firstName, member.lastName)}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors tracking-tight">
              {getFullName(member.firstName, member.lastName)}
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold border border-border/60 bg-card/60 text-foreground-muted">
              {capitalize(member.role)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-muted font-mono">
            <span className="inline-flex items-center gap-1.5">
              <Mail size={12} className="text-foreground-muted/70" />
              {member.email}
            </span>
          </div>
        </div>
      </div>

      {/* --- Right Side --- */}
      <div className="flex sm:flex-col flex-row sm:items-end items-center justify-between sm:justify-center gap-2">
        <div
          className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-card/60 border border-border/60 shadow-xs"
          title={member.isOnline ? "Online" : "Offline"}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full shadow-lg ${getStatusColor(
              member.isOnline,
            )}`}
          />
          <span className="text-xs font-medium text-foreground-muted">
            {member.isOnline ? "Online" : "Offline"}
          </span>
        </div>

        <span className="text-[11px] text-foreground-muted/70 font-mono">
          {formatTimeAgo(member.lastLogin)}
        </span>
      </div>
    </Link>
  );
}

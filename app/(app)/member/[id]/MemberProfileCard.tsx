/**
 * @file MemberProfileCard.tsx
 * @description Client component rendering detailed profile information and activity metrics for a specific team member.
 */

"use client";

import { getFullName, getInitials, formatTimeAgo } from "@/utils/user";
import { Mail, Clock, ShieldCheck } from "lucide-react";
import { UserListItem } from "@/types/user";

/**
 * Properties for the MemberProfileCard component.
 *
 * @interface MemberProfileCardProps
 * @property {UserListItem} member - The user item containing detailed profile data, activity status, and credentials.
 */
interface MemberProfileCardProps {
  member: UserListItem;
}

/**
 * Renders a detailed profile card for a team member, including user avatar initials, online status indicators,
 * contact information, and activity metrics.
 *
 * @param {MemberProfileCardProps} props - The component props.
 * @returns {JSX.Element} The rendered member profile card component.
 */
export default function MemberProfileCard({ member }: MemberProfileCardProps) {
  const stats = [
    {
      label: "Last Activity",
      value: formatTimeAgo(member.lastLogin),
      icon: Clock,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Account Status",
      value: "Active - Member",
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="relative bg-card/40 border border-border/80 rounded-3xl p-4 sm:p-6 shadow-sm overflow-hidden">
      {/* Accent Bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${member.isOnline ? "bg-emerald-500" : "bg-slate-600"}`}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-2">
        <div className="flex items-center gap-5">
          <div
            className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-xl font-black tracking-wider text-white shadow-xl border-2 border-card ring-2 ring-border/50 ${member.color}`}
            style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)" }}
          >
            {getInitials(member.firstName, member.lastName)}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {getFullName(member.firstName, member.lastName)}
            </h1>
            <div className="flex items-center gap-2 text-foreground-muted font-mono text-xs sm:text-sm">
              <Mail size={14} className="shrink-0 text-foreground-muted/70" />
              <span className="truncate">{member.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/60 pl-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 p-4 rounded-2xl bg-card/30 border border-border/60 hover:border-primary/40 transition-colors"
          >
            <div
              className={`w-12 h-12 shrink-0 rounded-xl border flex items-center justify-center ${stat.color}`}
            >
              <stat.icon size={22} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-foreground-muted font-mono font-semibold">
                {stat.label}
              </p>
              <p className="text-sm font-semibold text-foreground truncate">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

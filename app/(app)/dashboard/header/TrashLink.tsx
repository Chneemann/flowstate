/**
 * @file dasboard/header/TrashLink.tsx
 * @description Client component rendering a navigation link button to the trash view with a dynamic item counter badge.
 */

"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";

/**
 * Renders an interactive trash icon link featuring hover animations and an optional item count badge.
 *
 * @param {Object} props - The component props.
 * @param {number} props.count - The number of items currently in the trash.
 * @returns {JSX.Element} The rendered trash button component.
 */
export default function TrashLink({ count }: { count: number }) {
  return (
    <Link
      href="/trash"
      className="relative group p-2 rounded-xl border border-border hover:border-primary transition-all duration-200"
      title="View Trash"
    >
      <Trash2
        size={16}
        className="text-foreground-muted group-hover:text-primary transition-colors"
      />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-destructive text-[9px] font-bold text-white shadow-sm ring-1 ring-background">
          {count}
        </span>
      )}
    </Link>
  );
}

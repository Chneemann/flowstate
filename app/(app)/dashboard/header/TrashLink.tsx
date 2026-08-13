/**
 * @file dashboard/header/TrashLink.tsx
 * @description Client component rendering a navigation link button to the trash view with a dynamic item counter badge fetched via SWR.
 */

"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import useSWR from "swr";

/**
 * Fetches data from a given URL and returns the parsed JSON response.
 *
 * @async
 * @param {string} url - The target endpoint URL to fetch.
 * @returns {Promise<any>} The JSON response data.
 */
const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Renders an interactive trash icon link featuring hover animations and a self-fetched item count badge.
 *
 * @returns {JSX.Element} The rendered trash link component.
 */
export default function TrashLink() {
  const { data } = useSWR("/api/trash/count", fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const count = data?.count || 0;

  return (
    <Link
      href="/trash"
      className="relative group p-2 rounded-xl border border-border hover:border-primary transition-all duration-200 active:scale-95 cursor-pointer"
      title="View Trash"
    >
      <Trash2
        size={18}
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

/**
 * @file app/components/layout/SearchBar.tsx
 * @description Client component managing URL search parameters with debounced input and smooth transition state.
 */

"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

const SEARCHABLE_ROUTES = ["/dashboard", "/trash"];

/**
 * Properties for the SearchBar component.
 *
 * @interface SearchBarProps
 * @property {string} [placeholder] - Placeholder text displayed inside the search input.
 * @property {number} [debounceMs] - Delay in milliseconds before updating the URL search parameter.
 * @property {boolean} [autoFocus] - Flag indicating whether the input should automatically gain focus on mount.
 */
interface SearchBarProps {
  placeholder?: string;
  debounceMs?: number;
  autoFocus?: boolean;
}

/**
 * Renders a debounced search bar input that syncs its local state with the URL's "search" query parameter.
 *
 * @param {SearchBarProps} props - The component props.
 * @returns {JSX.Element | null} The rendered search bar component or null if the current route is not searchable.
 */
export default function SearchBar({
  placeholder = "Search...",
  debounceMs = 400,
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Check whether the current route supports the search
  const isSearchableRoute = SEARCHABLE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const searchQuery = searchParams.get("search") || "";
  const [localValue, setLocalValue] = useState(searchQuery);
  const [isPending, startTransition] = useTransition();

  // Synchronize state when the path or URL changes
  useEffect(() => {
    setLocalValue(searchQuery);
  }, [searchQuery, pathname]);

  // Debounced URL Update
  useEffect(() => {
    if (!isSearchableRoute) return;

    const timer = setTimeout(() => {
      if (localValue !== searchQuery) {
        const params = new URLSearchParams(searchParams.toString());
        if (localValue.trim()) {
          params.set("search", localValue.trim());
        } else {
          params.delete("search");
        }

        startTransition(() => {
          router.push(`?${params.toString()}`, { scroll: false });
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [
    localValue,
    searchQuery,
    searchParams,
    debounceMs,
    router,
    isSearchableRoute,
  ]);

  if (!isSearchableRoute) {
    return null;
  }

  /**
   * Resets the local search input value to an empty string.
   */
  const handleClear = () => {
    setLocalValue("");
  };

  return (
    <div
      className={`flex items-center bg-card border border-border rounded-lg px-2.5 sm:px-3 py-1.25 md:py-1.5 shadow-sm text-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all w-full ${
        isPending ? "opacity-70" : "opacity-100"
      }`}
    >
      <Search className="w-4 h-4 text-foreground-muted shrink-0 mr-2" />
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        autoFocus={autoFocus}
        className="bg-transparent focus:outline-none w-full placeholder:text-foreground-muted/60"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="p-1 text-foreground-muted hover:text-foreground shrink-0 ml-1 cursor-pointer rounded-md hover:bg-foreground/5 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/**
 * @file utils/user.ts
 * @description Utility functions for user formatting, initials generation, and name capitalization.
 */

/**
 * Capitalizes the first letter of a given string.
 *
 * @param {string} [str] - The string to capitalize.
 * @returns {string} The capitalized string or an empty string if undefined/empty.
 */
export function capitalize(str?: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Generates the full name with properly capitalized first and last names.
 *
 * @param {string} [firstName] - The user's first name.
 * @param {string} [lastName] - The user's last name.
 * @returns {string} The formatted full name.
 */
export function getFullName(firstName?: string, lastName?: string): string {
  const formattedFirst = capitalize(firstName);
  const formattedLast = capitalize(lastName);
  return `${formattedFirst} ${formattedLast}`.trim();
}

/**
 * Generates uppercase initials from a user's first and last name.
 *
 * @param {string} [firstName] - The user's first name.
 * @param {string} [lastName] - The user's last name.
 * @returns {string} The computed initials (e.g., "JD") or a fallback question mark "?" if neither is provided.
 */
export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return `${first}${last}`.toUpperCase() || "?";
}

/**
 * Returns the CSS classes for the user's online status indicator.
 *
 * @param {boolean} isOnline - Whether the user is currently online.
 * @returns {string} Tailwind CSS classes representing the status dot indicator.
 */
export function getStatusColor(isOnline: boolean): string {
  return isOnline
    ? "bg-emerald-500 shadow-emerald-500/50"
    : "bg-slate-600 shadow-none";
}

/**
 * Formats a given login date into a human-readable relative time string (e.g., "2 days ago").
 *
 * @param {Date | string | null} [dateInput] - The login date to format.
 * @returns {string} A relative time string formatted via Intl.RelativeTimeFormat, or a fallback message if no date is provided.
 */
export function formatTimeAgo(dateInput?: Date | string | null): string {
  if (!dateInput) return "Never logged in";

  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const intervals: { limit: number; unit: Intl.RelativeTimeFormatUnit }[] = [
    { limit: 60, unit: "second" },
    { limit: 3600, unit: "minute" },
    { limit: 86400, unit: "hour" },
    { limit: 2592000, unit: "day" },
    { limit: 31536000, unit: "month" },
    { limit: Infinity, unit: "year" },
  ];

  const divisors = [1, 60, 3600, 86400, 2592000, 31536000];

  for (let i = 0; i < intervals.length; i++) {
    const divisor = divisors[i];
    if (
      Math.abs(diffInSeconds) < intervals[i].limit ||
      i === intervals.length - 1
    ) {
      const value = Math.round(diffInSeconds / divisor);
      return rtf.format(value, intervals[i].unit);
    }
  }

  return "Never logged in";
}

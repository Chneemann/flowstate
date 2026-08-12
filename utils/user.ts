/**
 * @file utils/user.ts
 * @description Utility functions for user formatting and initials generation.
 */

/**
 * Generates uppercase initials from a user's first and last name.
 *
 * @param {string} [firstName] - The user's first name.
 * @param {string} [lastName] - The user's last name.
 * @returns {string} The computed initials (e.g., "JD") or a question mark if neither is provided.
 */
export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return `${first}${last}`.toUpperCase() || "?";
}

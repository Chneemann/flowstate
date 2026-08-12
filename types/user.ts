/**
 * @file types/user.ts
 * @description Type definitions and constants related to user entities and UI preferences.
 */

import { type User as DbUser } from "@/db/schema";

// ==========================================
// Types
// ==========================================

export type { DbUser };
export type UserColor = (typeof AVAILABLE_COLORS)[number];

// ==========================================
// UI Configurations
// ==========================================

export const AVAILABLE_COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-sky-500",
  "bg-teal-500",
] as const satisfies readonly string[];

/**
 * @file app/lib/utils/legal.ts
 * @description Defines legal navigation configurations, icon mappings, and dynamic copyright text generators.
 */

import { FileText, ShieldCheck } from "lucide-react";

/**
 * List of legal navigation links with their corresponding route paths and icon identifiers.
 */
export const LEGAL_LINKS = [
  { name: "Imprint", href: "/imprint", iconName: "FileText" },
  { name: "Privacy Policy", href: "/privacy", iconName: "ShieldCheck" },
] as const;

/**
 * Mapping object linking string identifiers to their respective Lucide icon components.
 */
export const ICON_MAP = {
  FileText: FileText,
  ShieldCheck: ShieldCheck,
};

/**
 * Generates the standardized copyright notice string with the given year.
 *
 * @param {number} year - The current target year for the copyright notice.
 * @returns {string} The formatted copyright text string.
 */
export const COPYRIGHT_TEXT = (year: number) =>
  `© ${year} André Kempf. All rights reserved.`;

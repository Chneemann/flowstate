/**
 * @file app/components/layout/Footer.tsx
 * @description Client component rendering the site footer with a copyright notice and links to legal pages like Imprint and Privacy Policy.
 */

"use client";

import Link from "next/link";

/**
 * Renders the application footer containing dynamic copyright information and legal navigation links.
 *
 * @returns {JSX.Element} The rendered footer component.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background text-xs px-3 py-3 border-t border-border">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left: Copyright Notice */}
        <p className="order-1 md:order-1">
          &copy; {currentYear} André Kempf. All rights reserved.
        </p>

        {/* Right: Legal & Compliance Links */}
        <div className="flex gap-4 order-2 md:order-3">
          <Link
            href="/imprint"
            className="hover:text-primary transition-colors"
          >
            Imprint
          </Link>
          <span>|</span>
          <Link
            href="/privacy"
            className="hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

/**
 * @file app/components/layout/Footer.tsx
 * @description Client component rendering the site footer with a copyright notice and links to legal pages like Imprint and Privacy Policy.
 */

"use client";

import Link from "next/link";
import { LEGAL_LINKS, COPYRIGHT_TEXT, ICON_MAP } from "@/lib/utils/legal";

/**
 * Renders the site footer containing the dynamic copyright notice and legal compliance links with icons.
 *
 * @returns {JSX.Element} The rendered footer component.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background text-xs px-3 py-3 border-t border-border">
      <div className="mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left: Copyright Notice */}
        <p className="order-1 md:order-1 text-foreground-muted">
          {COPYRIGHT_TEXT(currentYear)}
        </p>

        {/* Right: Legal & Compliance Links */}
        <div className="flex items-center gap-4 order-2 md:order-3 text-foreground-muted">
          {LEGAL_LINKS.map((link, index) => {
            const IconComponent = ICON_MAP[link.iconName];

            return (
              <div key={link.href} className="flex items-center gap-4">
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
                >
                  <IconComponent className="w-3.5 h-3.5 text-foreground-muted group-hover:text-primary transition-colors" />
                  <span>{link.name}</span>
                </Link>
                {index < LEGAL_LINKS.length - 1 && (
                  <span className="text-foreground-muted">|</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

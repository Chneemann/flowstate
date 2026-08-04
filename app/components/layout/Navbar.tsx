/**
 * @file Navbar.tsx
 * @description Client component providing responsive navigation for desktop and mobile views with active route indicators.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText } from "lucide-react";

/**
 * Array of navigation items containing their name, route path, and corresponding icon.
 */
const navItems = [
  { name: "Summary", href: "/summary", icon: FileText },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

/**
 * Renders the responsive navigation bar featuring desktop sidebar layout
 * and mobile bottom bar layout with active state styling.
 *
 * @returns {JSX.Element} The rendered navigation component.
 */
export default function Navbar() {
  const pathname = usePathname();

  // Shared function to render navigation links to avoid code duplication
  const renderNavLinks = (isMobile = false) =>
    navItems.map((item) => {
      const Icon = item.icon;
      const isActive =
        pathname === item.href ||
        (item.href !== "/" && pathname.startsWith(item.href));

      return (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive ? "page" : undefined}
          className={
            isMobile
              ? `flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive
                    ? " cursor-default pointer-events-none"
                    : "text-foreground-muted hover:text-foreground"
                }`
              : `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-foreground/10 cursor-default pointer-events-none"
                    : "text-foreground-muted hover:text-foreground hover:bg-foreground/5"
                }`
          }
        >
          <Icon
            className={`${isMobile ? "w-5 h-5" : "w-4 h-4"} ${isActive ? "text-primary" : ""}`}
          />
          <span className={isMobile ? "text-xs font-medium" : ""}>
            {item.name}
          </span>
        </Link>
      );
    });

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-col mt-6 space-y-1">
        {renderNavLinks(false)}
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden h-16 border-t border-border backdrop-blur-xl px-6 flex items-center justify-around fixed bottom-0 left-0 right-0 z-50 bg-background-muted">
        {renderNavLinks(true)}
      </nav>
    </>
  );
}

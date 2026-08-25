/**
 * @file app/components/layout/Header.tsx
 * @description Server component header arranging mobile logo, responsive search bar glued to the logo on mobile, and user badge.
 */

import BrandLogo from "./BrandLogo";
import SearchBar from "../ui/SearchBar";
import UserBadge from "./UserBadge";

/**
 * Renders the primary application header navigation bar, containing the responsive brand logo, search input, and user profile badge.
 *
 * @returns {JSX.Element} The rendered top header navigation component.
 */
export default function Header() {
  return (
    <header className="h-16 md:h-20 border-b border-border backdrop-blur-md px-3 sm:px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 md:z-0 bg-background/80">
      {/* Left Sidebar: Logo & Search Bar */}
      <div className="flex items-center gap-2 flex-1 max-w-sm md:max-w-md mr-6">
        <div className="md:hidden flex items-center shrink-0">
          <BrandLogo />
        </div>
        <div className="flex-1">
          <SearchBar />
        </div>
      </div>

      {/* Right-hand side: User Badge */}
      <div className="shrink-0 flex items-center">
        <UserBadge />
      </div>
    </header>
  );
}

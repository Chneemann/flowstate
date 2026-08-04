/**
 * @file Header.tsx
 * @description Application header component containing the mobile brand logo and the user badge navigation.
 */

import BrandLogo from "./BrandLogo";
import UserBadge from "./UserBadge";

/**
 * Renders the sticky top navigation header, displaying the brand logo on mobile views
 * and the user profile badge on the right side.
 *
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header() {
  return (
    <header className="h-20 border-b border-border backdrop-blur-md p-4 flex items-center md:justify-end justify-between sticky top-0 z-50">
      {/* Brand Element */}
      <div className="md:hidden flex items-center gap-3">
        <BrandLogo />
      </div>

      {/* User Badge */}
      <UserBadge />
    </header>
  );
}

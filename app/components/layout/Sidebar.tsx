/**
 * @file components/layout/Sidebar.tsx
 * @description Server/Client component rendering the desktop application sidebar layout including the brand logo, navigation links, and sign-out option.
 */

import BrandLogo from "./BrandLogo";
import Navbar from "./Navbar";
import SignOutButton from "../ui/buttons/SignOutButton";

/**
 * Renders the responsive desktop sidebar containing top navigation elements
 * and a bottom sign-out action button.
 *
 * @returns {JSX.Element} The rendered sidebar component.
 */
export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col justify-between h-full p-4 select-none border-r border-border shrink-0">
      {/* Upper Section */}
      <div className="flex flex-col">
        <BrandLogo />
        <Navbar />
      </div>

      {/* Lower Section */}
      <SignOutButton align="center" />
    </aside>
  );
}

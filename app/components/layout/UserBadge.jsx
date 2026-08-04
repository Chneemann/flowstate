/**
 * @file UserBadge.tsx
 * @description Component rendering a user avatar badge with name and online status indicator.
 */

import Image from "next/image";

/**
 * Renders a user profile badge including an avatar image, name, and current status.
 *
 * @returns {JSX.Element} The rendered user badge component.
 */
export default function UserBadge() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full relative overflow-hidden border border-border">
        <Image
          src="https://randomuser.me/api/portraits/women/1.jpg"
          alt="User Avatar"
          fill
          className="object-cover"
        />
      </div>
      <div className="hidden sm:block text-left">
        <p className="text-sm">Charlotte W.</p>
        <p className="text-foreground-muted text-xs">Online</p>
      </div>
    </div>
  );
}

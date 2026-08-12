/**
 * @file UserBadge.tsx
 * @description Server component rendering the authenticated user profile badge with initials and name.
 */

import { auth } from "@/auth";
import { UserService } from "@/services/user.service";
import { getInitials } from "@/utils/user";

/**
 * Renders a user profile badge including an avatar initial circle with user color and full name.
 *
 * @async
 * @returns {Promise<JSX.Element | null>} The rendered user badge component, or null if unauthenticated.
 */
export default async function UserBadge() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await UserService.findProfileById(session.user.id);
  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initials = getInitials(user.firstName, user.lastName);
  const bgColor = user.color || "bg-primary";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black tracking-wider text-white shadow-md border-2 border-card ring-2 ring-border/50 shrink-0 ${bgColor}`}
        style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)" }}
      >
        {initials}
      </div>
      <div className="hidden sm:block text-left">
        <p className="text-sm font-medium leading-tight">{fullName}</p>
        <p className="text-foreground-muted text-xs">Online</p>
      </div>
    </div>
  );
}

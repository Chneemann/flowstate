/**
 * @file app/components/layout/UserBadge.tsx
 * @description Server component rendering the authenticated user profile badge with initials, name, and online status.
 */

import { auth } from "@/auth";
import { UserService } from "@/lib/services/user.service";
import { getInitials } from "@/lib/utils/user";

/**
 * Renders a user profile badge including an avatar initial circle with user color, full name, and online status indicator.
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
  const bgColor = user.color;
  const lastLogin = user.lastLogin;

  const formattedLastLogin = new Date(lastLogin!).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="flex items-center gap-3"
      title={`Last Login: ${formattedLastLogin}`}
    >
      <div className="relative shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black tracking-wider text-white shadow-md border-2 border-card ring-2 ring-border/50 ${bgColor}`}
          style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)" }}
        >
          {initials}
        </div>

        <span
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card bg-emerald-500"
          title="Online"
        />
      </div>

      <div className="hidden sm:block text-left">
        <p className="text-sm font-medium leading-tight">{fullName}</p>
        <p className="text-foreground-muted text-xs flex items-center gap-1.5">
          Online
        </p>
      </div>
    </div>
  );
}

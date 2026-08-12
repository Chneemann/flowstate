/**
 * @file dashboard/card/CardAvatars.tsx
 * @description Client component rendering team avatars and creator badge for a card.
 */

"use client";

import { Crown } from "lucide-react";
import { Task } from "@/types/task";
import { getInitials } from "@/utils/user";

/**
 * Properties for the UserAvatar component.
 *
 * @interface UserAvatarProps
 * @property {Task["creator"]} user - The user object to render.
 * @property {string} title - The role description (e.g., "Creator" or "Assignee").
 * @property {boolean} [isCreator] - Optional flag indicating if the user is the creator.
 */
interface UserAvatarProps {
  user: Task["creator"];
  title: string;
  isCreator?: boolean;
}

/**
 * Renders a single user avatar circle with optional crown badge.
 *
 * @param {UserAvatarProps} props - The component props.
 * @returns {JSX.Element} The rendered user avatar component.
 */
function UserAvatar({ user, title, isCreator }: UserAvatarProps) {
  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = getInitials(user.firstName, user.lastName);
  const bgColor = user.color;

  return (
    <div
      className={`relative group/avatar group-hover/avatars:scale-100 hover:scale-110 hover:z-20 transition-all duration-200 cursor-default`}
      title={`${title}: ${fullName}`}
    >
      <div
        className={`w-7 h-7 rounded-full border-2 border-border flex items-center justify-center text-xs font-black tracking-wider text-white shadow-md ring-2 ring-border/50 hover:ring-primary hover:ring-1 transition-all duration-200 ${bgColor}`}
        style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)" }}
      >
        {initials}
      </div>

      {isCreator && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-600 rounded-full border-2 border-border flex items-center justify-center shadow-sm">
          <Crown
            size={8}
            className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          />
        </span>
      )}
    </div>
  );
}

/**
 * Properties for the CardAvatars component.
 *
 * @interface CardAvatarsProps
 * @property {Task["creator"]} creator - The creator user object.
 * @property {Task["assignees"]} assignees - The list of assigned user objects.
 */
interface CardAvatarsProps {
  creator: Task["creator"];
  assignees: Task["assignees"];
}

/**
 * Renders overlapping avatar indicators for task assignees and a dedicated, crowned badge for the task creator.
 *
 * @param {CardAvatarsProps} props - The component props.
 * @returns {JSX.Element | null} The rendered card avatars container or null if no users are available.
 */
export default function CardAvatars({
  creator,
  assignees = [],
}: CardAvatarsProps) {
  const filteredAssignees = (assignees || []).filter(
    (assignee) => assignee.id !== creator?.id,
  );

  if (!creator && filteredAssignees.length === 0) return null;

  return (
    <div className="flex items-center shrink-0 -space-x-2.5 group/avatars hover:space-x-0.5 transition-all duration-300">
      {filteredAssignees.map((assignee) => (
        <UserAvatar key={assignee.id} user={assignee} title="Assignee" />
      ))}

      {creator && (
        <UserAvatar user={creator} title="Creator" isCreator={true} />
      )}
    </div>
  );
}

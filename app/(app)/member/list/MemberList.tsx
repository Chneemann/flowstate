/**
 * @file app/(app)/member/list/MemberList.tsx
 * @description Client component rendering the list of team members along with the section header and an empty state fallback.
 */

"use client";

import MemberHeader from "../MemberHeader";
import { UserListItem } from "@/lib/types/user";
import MemberItem from "./MemberItem";

/**
 * Properties for the MembersList component.
 *
 * @interface MemberListProps
 * @property {UserListItem[]} members - Array of user items to display in the list.
 */
interface MemberListProps {
  members: UserListItem[];
}

/**
 * Renders the member directory section including the section header, a responsive list of team members,
 * or an empty state message if no members are available.
 *
 * @param {MembersListProps} props - The component props.
 * @returns {JSX.Element} The rendered members list section component.
 */
export default function MemberList({ members }: MemberListProps) {
  return (
    <div className="space-y-6 mx-auto">
      <MemberHeader />

      {members.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-3xl bg-card/20 space-y-2">
          <p className="text-sm font-medium text-foreground-muted">
            No team members found.
          </p>
          <p className="text-xs text-foreground-muted/65">
            There are no users registered yet.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 list-none">
          {members.map((member) => (
            <li key={member.id}>
              <MemberItem member={member} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

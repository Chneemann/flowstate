/**
 * @file app/(app)/member/page.tsx
 * @description Server component rendering the members directory page by fetching all registered users and passing them to the MemberList component.
 */

import MemberList from "./list/MemberList";
import { UserService } from "@/lib/services/user.service";

/**
 * Renders the member management page displaying all registered users in a list container.
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered member page component.
 */
export default async function MemberPage() {
  const users = await UserService.findAllUsers();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <MemberList members={users} />
    </div>
  );
}

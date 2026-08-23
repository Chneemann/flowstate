/**
 * @file app/(app)/member/[id]/page.tsx
 * @description Server component rendering the detailed profile page for a specific member by validating the ID format and fetching user profile data.
 */

import { UserService } from "@/lib/services/user.service";
import { redirect } from "next/navigation";
import MemberHeader from "../MemberHeader";
import MemberProfileCard from "./MemberProfileCard";

/**
 * Renders the member detail page by resolving route parameters, validating the member ID syntax,
 * fetching profile data, and displaying the header and profile card or redirecting with an error parameter if not found.
 *
 * @async
 * @param {Object} props - The component props.
 * @param {Promise<{ id: string }>} props.params - Promise containing route context parameters with the target member ID.
 * @returns {Promise<JSX.Element>} The rendered member detail page component.
 */
export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!UUID_REGEX.test(id)) {
    redirect("/member?error=member_not_found");
  }

  const user = await UserService.findProfileById(id);

  if (!user) {
    redirect("/member?error=member_not_found");
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <MemberHeader />
      <MemberProfileCard member={user} />
    </div>
  );
}

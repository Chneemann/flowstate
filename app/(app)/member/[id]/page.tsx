/**
 * @file member/[id]/page.tsx
 * @description Server component rendering the detailed profile page for a specific member by fetching their user profile data.
 */

import { UserService } from "@/services/user.service";
import { notFound } from "next/navigation";
import MemberHeader from "../MemberHeader";
import MemberProfileCard from "./MemberProfileCard";

/**
 * Properties for the MemberDetailPage component.
 *
 * @interface MemberDetailPageProps
 * @property {Promise<{ id: string }>} params - Promise containing route context parameters with the target member ID.
 */
interface MemberDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Renders the member detail page by resolving the route parameter, fetching the user profile by ID,
 * and displaying their header and profile card or triggering a 404 page if the member is not found.
 *
 * @async
 * @param {MemberDetailPageProps} props - The component props.
 * @returns {Promise<JSX.Element>} The rendered member detail page component.
 */
export default async function MemberDetailPage({
  params,
}: MemberDetailPageProps) {
  const { id } = await params;
  const user = await UserService.findProfileById(id);

  if (!user) notFound();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <MemberHeader />
      <MemberProfileCard member={user} />
    </div>
  );
}

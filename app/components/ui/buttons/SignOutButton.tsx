/**
 * @file SignOutButton.tsx
 * @description Server Action-powered client component rendering a sign-out button that triggers session termination via a server action.
 */

import { handleSignOut } from "@/auth";
import { LogOut } from "lucide-react";

/**
 * Renders a form containing a submit button to securely sign out the current user session using a server action.
 *
 * @returns {JSX.Element} The rendered sign-out button component.
 */
export default function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:text-primary-hover transition-colors w-full cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign out</span>
      </button>
    </form>
  );
}

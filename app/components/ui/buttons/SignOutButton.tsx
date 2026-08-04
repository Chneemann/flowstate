/**
 * @file SignOutButton.tsx
 * @description Server Action-powered client component that allows users to sign out and redirect to the home page.
 */

import { signOut } from "@/auth";
import { LogOut } from "lucide-react";

/**
 * Renders a sign-out button using a Server Action to securely terminate the user session.
 *
 * @returns {JSX.Element} The rendered sign-out button component.
 */
export default function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
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

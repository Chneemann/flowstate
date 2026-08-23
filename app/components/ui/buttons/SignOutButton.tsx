/**
 * @file app/components/ui/buttons/SignOutButton.tsx
 * @description Server Action-powered client component rendering a sign-out button with customizable alignment.
 */

import { handleSignOut } from "@/lib/actions/auth.actions";
import { LogOut } from "lucide-react";

/**
 * Renders a sign-out button wrapped in a form that invokes the handleSignOut Server Action upon submission.
 *
 * @param {Object} props - The component props.
 * @param {"left" | "center"} [props.align="left"] - Text and content alignment for the button contents.
 * @returns {JSX.Element} The rendered sign-out button component.
 */
export default function SignOutButton({
  align = "left",
}: {
  align?: "left" | "center";
}) {
  return (
    <form action={handleSignOut} className="w-full">
      <button
        type="submit"
        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer ${
          align === "center" ? "justify-center" : "text-left"
        }`}
      >
        <LogOut className="w-4 h-4 shrink-0" />
        <span>Sign Out</span>
      </button>
    </form>
  );
}

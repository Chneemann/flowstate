/**
 * @file app/components/ui/buttons/GoBackButton.tsx
 * @description Client component rendering an interactive back button with intelligent history checking and animated hover effects.
 */

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

/**
 * Properties for the GoBackButton component.
 *
 * @interface GoBackButtonProps
 * @extends {ComponentPropsWithoutRef<"button">}
 * @property {string} [fallbackUrl] - The backup route URL to navigate to if no browser history exists.
 * @property {string} [label] - The text label displayed next to the arrow icon.
 */
interface GoBackButtonProps extends ComponentPropsWithoutRef<"button"> {
  fallbackUrl?: string;
  label?: string;
}

/**
 * Renders a back button that navigates to the previous history entry if available,
 * or falls back to a default URL, featuring an animated left arrow icon and underline effects.
 *
 * @param {GoBackButtonProps} props - The component props.
 * @returns {JSX.Element} The rendered go back button component.
 */
export function GoBackButton({
  fallbackUrl = "/",
  label = "previous page",
  className = "",
  onClick,
  ...props
}: GoBackButtonProps) {
  const router = useRouter();

  /**
   * Handles the click event, triggering custom click actions if provided,
   * and determining whether to pop history or redirect to the fallback URL.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} e - The mouse event object.
   */
  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (e.defaultPrevented) return;
    e.preventDefault();

    const hasHistory = window.history.state && window.history.state.idx > 0;

    if (hasHistory) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 text-xs text-primary hover:text-primary-hover transition-colors group bg-transparent border-none p-0 cursor-pointer ${className}`}
      {...props}
    >
      <ArrowLeft
        size={14}
        aria-hidden="true"
        className="group-hover:-translate-x-1 transition-transform shrink-0"
      />

      <span className="relative pb-0.5">
        Back to {label}
        <span
          className="absolute left-0 bottom-0 h-px w-0 bg-primary transition-all duration-300 ease-in-out group-hover:w-full"
          aria-hidden="true"
        />
      </span>
    </button>
  );
}

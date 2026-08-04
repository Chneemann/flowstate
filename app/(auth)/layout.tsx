/**
 * @file AuthLayout.tsx
 * @description Layout component wrapping authentication views with a centered container structure.
 */

import React from "react";

/**
 * Renders a centered layout wrapper optimized for authentication pages (login, registration, etc.).
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The inner child components/pages to render inside the layout.
 * @returns {JSX.Element} The rendered authentication layout component.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-full items-center justify-center p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

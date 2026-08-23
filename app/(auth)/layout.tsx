/**
 * @file app/(auth)/layout.tsx
 * @description Layout component wrapping authentication views with a centered container structure and fixed bottom footer.
 */

import React from "react";
import Footer from "../components/layout/Footer";

/**
 * Renders a centered layout wrapper optimized for authentication pages (login, registration, etc.),
 * including a fixed footer at the bottom of the viewport.
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

      <div className="absolute bottom-0 left-0 right-0">
        <Footer />
      </div>
    </div>
  );
}

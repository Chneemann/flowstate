/**
 * @file layout.tsx
 * @description Root layout component defining global HTML structure, metadata, and Tailwind styling for the application.
 */

import type { Metadata } from "next";
import "./globals.css";

/**
 * Global application metadata configuration for SEO and browser tabs.
 */
export const metadata: Metadata = {
  title: "Flowstate - Modern Kanban",
  description: "Dein High-Performance Workflow Dashboard",
};

/**
 * Renders the root HTML layout wrapping all pages with global settings, styles, and themes.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components/pages to render within the layout.
 * @returns {JSX.Element} The rendered root layout component.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="dark h-full">
      <body className="flex h-dvh overflow-hidden bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}

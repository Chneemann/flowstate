/**
 * @file (app)/layout.tsx
 * @description Server component layout protecting authenticated routes by verifying user sessions and arranging the main dashboard application structure with responsive sidebars, headers, navigation bars, error toasts, and footers.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/app/components/layout/Sidebar";
import Header from "@/app/components/layout/Header";
import Navbar from "@/app/components/layout/Navbar";
import ErrorToast from "../components/ErrorToast";
import Footer from "@/app/components/layout/Footer";

/**
 * Renders the main application layout for authenticated views, checking user sessions
 * and assembling the responsive page shell.
 *
 * @async
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The inner child components/pages to render inside the authenticated layout.
 * @returns {Promise<JSX.Element>} The rendered application layout component.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = typeof auth === "function" ? await auth() : null;

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <ErrorToast />
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-4 md:pb-0">
        <Header />

        <div className="flex-1 overflow-y-auto flex flex-col">
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>

        <div className="hidden md:flex">
          <Footer />
        </div>

        <div className="md:hidden flex">
          <Navbar />
        </div>
      </div>
    </>
  );
}

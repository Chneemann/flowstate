import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Navbar from "./components/layout/Navbar";

/**
 * Global page metadata
 */
export const metadata: Metadata = {
  title: "Flowstate - Modern Kanban",
  description: "Dein High-Performance Workflow Dashboard",
};

/**
 * Root application layout providing global shell UI
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="dark h-full">
      <body className="flex h-dvh overflow-hidden">
        {/* Sidebar (Desktop only) */}
        <div className="hidden md:flex ">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>

          {/* Mobile Navbar (Mobile only) */}
          <div className="md:hidden flex">
            <Navbar />
          </div>
        </div>
      </body>
    </html>
  );
}

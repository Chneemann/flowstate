import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/app/components/layout/Sidebar";
import Header from "@/app/components/layout/Header";
import Navbar from "@/app/components/layout/Navbar";

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
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
        <div className="md:hidden flex">
          <Navbar />
        </div>
      </div>
    </>
  );
}

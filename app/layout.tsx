import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flowstate - Modern Kanban",
  description: "Dein High-Performance Workflow Dashboard",
};

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

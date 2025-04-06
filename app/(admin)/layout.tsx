import type React from "react";
import { Roboto } from "next/font/google";
import { AdminSideBar } from "@/components/AdminSideBar";
import { ModeToggle } from "@/components/ModeToggle";
import { AdminNav } from "@/components/AdminNav";
import "../globals.css";
import { Toaster } from "sonner";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={`${roboto.className} antialiased`}>
        <div className="flex min-h-screen">
          <AdminSideBar />
          <div className="flex-1">
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
              <div className="flex flex-1 items-center justify-end space-x-4">
                <div className="flex items-center space-x-4">
                  <ModeToggle />
                  <AdminNav />
                </div>
              </div>
            </header>
            <main className="flex-1 p-6">
              {children}
              <Toaster richColors />
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

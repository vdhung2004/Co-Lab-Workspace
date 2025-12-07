// app/admin/layout.tsx
import { Navbar } from "@/components/admin/Navbar";
import { Sidebar } from "@/components/admin/Sidebar";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-auto">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "./components/profile-form";
// import { BookingsTable } from "./components/bookings-table";
import { ChangePasswordForm } from "./components/change-password-form";
import { BookingsTable } from "./components/bookings-table";

// Menu sidebar
const accountMenu = [
  { id: "profile", label: "Hồ sơ" },
  { id: "bookings", label: "Lịch sử đặt chỗ" },
  { id: "change-password", label: "Đổi mật khẩu" },
];

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  // Nếu chưa login
  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="container mx-auto my-10 flex gap-6">
      {/* Sidebar */}
      <aside className="w-64 border rounded-md p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-4">Tài khoản của bạn</h2>

        <nav className="flex-1 flex flex-col space-y-2">
          {accountMenu.map((item) => (
            <button
              key={item.id}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                activeTab === item.id
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      </aside>

      {/* Main content */}
      <main className="flex-1 border rounded-md p-6">
        {activeTab === "profile" && (
          <section>
            <h3 className="text-xl font-bold mb-4">Hồ sơ của bạn</h3>
            <ProfileForm />
          </section>
        )}

        {activeTab === "bookings" && (
          <section>
            <h3 className="text-xl font-bold mb-4">Lịch sử đặt chỗ</h3>
            <BookingsTable />
          </section>
        )}

        {activeTab === "change-password" && (
          <section>
            <h3 className="text-xl font-bold mb-4">Đổi mật khẩu</h3>
            <ChangePasswordForm />
          </section>
        )}
      </main>
    </div>
  );
}

"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "./components/profile-form";
import { BookingsTable } from "./components/bookings-table";
import { ChangePasswordForm } from "./components/change-password-form";

const accountMenu = [
  { id: "profile", label: "Hồ sơ" },
  { id: "bookings", label: "Lịch sử đặt chỗ" },
  { id: "change-password", label: "Đổi mật khẩu" },
];

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  console.log("AccountPage user:", user);

  if (!user) {
    // router.push("/login"); // redirect nếu chưa login
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="container mx-auto my-10 flex gap-6">
      {/* Sidebar */}
      <aside className="w-64 border rounded-md p-4">
        <h2 className="text-lg font-bold mb-4">Tài khoản của bạn</h2>
        <ul className="space-y-2">
          {accountMenu.map((item) => (
            <li key={item.id}>
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${
                  activeTab === item.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 border rounded-md p-6">
        {/* ----- Profile Tab ----- */}
        {activeTab === "profile" && user && (
          <div>
            <h3 className="text-xl font-bold mb-4">Hồ sơ của bạn</h3>
            <ProfileForm />
          </div>
        )}

        {/* ----- Bookings Tab ----- */}
        {activeTab === "bookings" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Lịch sử đặt chỗ</h3>
            <BookingsTable />
          </div>
        )}

        {/* ----- Change Password Tab ----- */}
        {activeTab === "change-password" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Đổi mật khẩu</h3>
            <ChangePasswordForm />
          </div>
        )}
      </main>
    </div>
  );
}

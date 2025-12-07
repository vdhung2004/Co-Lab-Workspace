"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menu = [
  { label: "Thông tin cá nhân", href: "/profile" },
  { label: "Lịch sử đặt chỗ", href: "/profile/bookings" }, // ← HIỂN THỊ
  { label: "Đổi mật khẩu", href: "/profile/change-password" },
  { label: "Đăng xuất", href: "/profile/logout" },
];

export function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r p-4 space-y-1">
      {menu.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "block px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm",
            pathname === item.href && "bg-accent text-accent-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}

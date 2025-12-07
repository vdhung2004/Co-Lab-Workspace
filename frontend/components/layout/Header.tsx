"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth.context";

/* ------------------- HEADER ------------------- */
export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto flex items-center justify-between py-4">
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold">
          LOGO
        </Link>

        {/* NAVIGATION */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className={navigationMenuTriggerStyle()}>
                  Trang chủ
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Dịch vụ */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Dịch vụ</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-4 p-4">
                  <NavigationMenuLink asChild>
                    <Link href="/dich-vu/cho-ngoi">
                      <div className="font-medium">Chỗ ngồi</div>
                      <div className="text-muted-foreground text-sm">
                        Đặt chỗ ngồi linh hoạt theo giờ.
                      </div>
                    </Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink asChild>
                    <Link href="/dich-vu/phong-hop">
                      <div className="font-medium">Phòng họp</div>
                      <div className="text-muted-foreground text-sm">
                        Không gian phòng họp chuyên nghiệp.
                      </div>
                    </Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink asChild>
                    <Link href="/dich-vu/khac">
                      <div className="font-medium">Dịch vụ khác</div>
                      <div className="text-muted-foreground text-sm">
                        Khám phá các dịch vụ bổ sung.
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/dia-diem" className={navigationMenuTriggerStyle()}>
                  Địa điểm
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/lien-he" className={navigationMenuTriggerStyle()}>
                  Liên hệ
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA / USER MENU */}
        <div className="flex items-center gap-4">
          {!user ? (
            <Link href="/login" className="text-sm hover:underline">
              Đăng nhập
            </Link>
          ) : (
            <UserMenu user={user} onLogout={handleLogout} />
          )}

          <Link href="/dat-dich-vu">
            <Button>Đặt dịch vụ</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ------------------- USER MENU ------------------- */
function UserMenu({
  user,
  onLogout,
}: {
  user: { fullName: string };
  onLogout: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium cursor-pointer">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem asChild>
          <Link href="/profile">Hồ sơ</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/bookings">Lịch sử đặt chỗ</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

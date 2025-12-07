"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth.context";

interface RouteGuardProps {
  children: ReactNode;
}

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Các route chỉ dành cho người chưa login
    const guestRoutes = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
    ];
    // Các route cần login
    const protectedRoutes = ["/dashboard", "/profile"];

    // Chặn guest routes nếu đã login
    if (user && guestRoutes.includes(pathname)) {
      router.replace("/"); // redirect sang trang chính
    }

    // Chặn protected routes nếu chưa login
    if (!user && protectedRoutes.includes(pathname)) {
      router.replace("/login");
    }

    // // Ví dụ thêm role check cho admin route
    // if (user && pathname.startsWith("/admin") && user.role !== "admin") {
    //   router.replace("/unauthorized"); // redirect trang 403
    // }
  }, [user, pathname, router]);

  // Nếu chưa login và route protected → return null (không render)
  if (!user && ["/dashboard", "/profile"].includes(pathname)) return null;
  // Nếu đã login và đang ở guest route → return null
  if (
    user &&
    ["/login", "/register", "/forgot-password", "/reset-password"].includes(
      pathname
    )
  )
    return null;

  return <>{children}</>;
};

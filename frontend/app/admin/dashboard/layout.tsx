// app/admin/dashboard/layout.tsx
'use client'
import { DashboardLayout } from '@/components/admin/dashboard/dashboard-layout';

// children ở đây sẽ là DashboardIndexPage (Overview) hoặc UsersPage
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // DashboardLayout này chứa Sidebar và được áp dụng cho mọi trang con
    <DashboardLayout>
      {children} 
    </DashboardLayout>
  );
}
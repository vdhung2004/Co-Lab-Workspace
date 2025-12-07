"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Users,
  Building2,
  Box,
  CalendarCheck,
  BarChart2,
} from "lucide-react";

export function Sidebar() {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const menuItemClass = "p-2 rounded flex items-center gap-2 hover:bg-gray-100";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 h-screen flex flex-col">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex-1 flex flex-col space-y-1 overflow-y-auto">
        <Link href="/admin" className={menuItemClass}>
          <LayoutDashboard size={16} /> Dashboard
        </Link>

        <Link href="/admin/users" className={menuItemClass}>
          <Users size={16} /> Users
        </Link>

        {/* Workspace menu */}
        <div>
          <button
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className={`${menuItemClass} justify-between w-full`}
          >
            <span className="flex items-center gap-2">
              <Building2 size={16} /> Workspaces
            </span>
            {workspaceOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          {workspaceOpen && (
            <div className="ml-4 mt-1 flex flex-col space-y-1">
              <Link href="/admin/workspaces/" className={menuItemClass}>
                <Box size={16} /> Workspace
              </Link>
              <Link href="/admin/workspaces/floor" className={menuItemClass}>
                <Box size={16} /> Floor
              </Link>
              <Link href="/admin/workspaces/space" className={menuItemClass}>
                <Box size={16} /> Space
              </Link>
            </div>
          )}
        </div>

        <Link href="/admin/facilities" className={menuItemClass}>
          <Box size={16} /> Quản lý tiện ích
        </Link>

        <Link href="/admin/bookings" className={menuItemClass}>
          <CalendarCheck size={16} /> Quản lý lượt đặt chỗ
        </Link>

        <Link href="/admin/reports" className={menuItemClass}>
          <BarChart2 size={16} /> Báo cáo thống kê
        </Link>
      </nav>
    </aside>
  );
}

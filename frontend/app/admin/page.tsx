"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Calendar, DollarSign } from "lucide-react";

/**
 * Admin Dashboard with key metrics
 * TODO: Replace mock data with API calls:
 * - GET /api/users (total count, filter by role)
 * - GET /api/workspaces (total count)
 * - GET /api/spaces (total count)
 * - GET /api/bookings (total count, sum amounts)
 * - GET /api/reports/stats (summary metrics)
 */

// Mock data matching database schema
type User = {
  id: string;
  role: "admin" | "customer";
  status: "active" | "locked";
};

type Workspace = {
  id: string;
  name: string;
};

type Space = {
  id: string;
  name: string;
  status: "available" | "occupied" | "maintenance";
};

type Booking = {
  id: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentAmount?: number;
  paymentStatus?: "pending" | "success" | "failed";
};

const mockUsers: User[] = [
  { id: "user-1", role: "admin", status: "active" },
  { id: "user-2", role: "customer", status: "active" },
  { id: "user-3", role: "customer", status: "locked" },
];

const mockWorkspaces: Workspace[] = [
  { id: "ws-1", name: "CoLab Downtown" },
  { id: "ws-2", name: "CoLab Tech Hub" },
  { id: "ws-3", name: "CoLab Binh Thanh" },
];

const mockSpaces: Space[] = [
  { id: "sp-1", name: "Desk 1", status: "available" },
  { id: "sp-2", name: "Meeting Room A", status: "occupied" },
  { id: "sp-3", name: "Desk 2", status: "maintenance" },
  { id: "sp-4", name: "Conference Room", status: "available" },
];

const mockBookings: Booking[] = [
  {
    id: "booking-1",
    status: "confirmed",
    paymentAmount: 100,
    paymentStatus: "success",
  },
  {
    id: "booking-2",
    status: "pending",
    paymentAmount: 200,
    paymentStatus: "pending",
  },
  {
    id: "booking-3",
    status: "completed",
    paymentAmount: 150,
    paymentStatus: "success",
  },
  {
    id: "booking-4",
    status: "cancelled",
    paymentAmount: 75,
    paymentStatus: "failed",
  },
];

export default function DashboardPage() {
  // Calculate metrics using useMemo
  const metrics = useMemo(() => {
    const totalUsers = mockUsers.length;
    const totalAdmins = mockUsers.filter((u) => u.role === "admin").length;
    const totalCustomers = totalUsers - totalAdmins;
    const totalWorkspaces = mockWorkspaces.length;
    const totalSpaces = mockSpaces.length;
    const availableSpaces = mockSpaces.filter(
      (s) => s.status === "available"
    ).length;
    const totalBookings = mockBookings.length;
    const completedBookings = mockBookings.filter(
      (b) => b.status === "completed"
    ).length;
    const totalRevenue = mockBookings.reduce(
      (sum, b) =>
        sum + (b.paymentStatus === "success" ? b.paymentAmount || 0 : 0),
      0
    );
    const successfulPayments = mockBookings.filter(
      (b) => b.paymentStatus === "success"
    ).length;

    return {
      totalUsers,
      totalAdmins,
      totalCustomers,
      totalWorkspaces,
      totalSpaces,
      availableSpaces,
      totalBookings,
      completedBookings,
      totalRevenue,
      successfulPayments,
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of system metrics and statistics
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.totalAdmins} admins, {metrics.totalCustomers} customers
            </p>
          </CardContent>
        </Card>

        {/* Workspaces Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalWorkspaces}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.totalSpaces} total spaces
            </p>
          </CardContent>
        </Card>

        {/* Bookings Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.completedBookings} completed
            </p>
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.successfulPayments} successful payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Space Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Available</span>
                <span className="font-bold">{metrics.availableSpaces}</span>
              </div>
              <div className="flex justify-between">
                <span>Occupied</span>
                <span className="font-bold">
                  {mockSpaces.filter((s) => s.status === "occupied").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Maintenance</span>
                <span className="font-bold">
                  {mockSpaces.filter((s) => s.status === "maintenance").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Confirmed</span>
                <span className="font-bold">
                  {mockBookings.filter((b) => b.status === "confirmed").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pending</span>
                <span className="font-bold">
                  {mockBookings.filter((b) => b.status === "pending").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Completed</span>
                <span className="font-bold">
                  {mockBookings.filter((b) => b.status === "completed").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

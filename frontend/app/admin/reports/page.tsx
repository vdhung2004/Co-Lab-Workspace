"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { GenericDataTable, Column } from "@/components/admin/GenericDataTable";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

/**
 * Reports & Analytics page with date range filtering
 * TODO: Replace mock data with API calls:
 * - GET /api/reports/stats (summary metrics)
 * - GET /api/bookings?startDate={from}&endDate={to} (bookings for period)
 * - GET /api/payments/summary (payment status breakdown)
 */

// Type definition for report bookings
type ReportBooking = {
  id: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  spaceNames: string[];
  paymentAmount: number;
  paymentStatus: "pending" | "success" | "failed";
  startTime: Date;
};

// Mock data matching database schema
const mockBookings: ReportBooking[] = [
  {
    id: "booking-1",
    status: "confirmed",
    spaceNames: ["Desk 1"],
    paymentAmount: 100,
    paymentStatus: "success",
    startTime: new Date("2025-12-01T10:00:00Z"),
  },
  {
    id: "booking-2",
    status: "pending",
    spaceNames: ["Room A"],
    paymentAmount: 200,
    paymentStatus: "pending",
    startTime: new Date("2025-12-02T14:00:00Z"),
  },
  {
    id: "booking-3",
    status: "completed",
    spaceNames: ["Meeting Room"],
    paymentAmount: 150,
    paymentStatus: "success",
    startTime: new Date("2025-12-03T09:00:00Z"),
  },
  {
    id: "booking-4",
    status: "confirmed",
    spaceNames: ["Desk 2"],
    paymentAmount: 75,
    paymentStatus: "success",
    startTime: new Date("2025-12-04T13:00:00Z"),
  },
  {
    id: "booking-5",
    status: "cancelled",
    spaceNames: ["Room B"],
    paymentAmount: 120,
    paymentStatus: "failed",
    startTime: new Date("2025-12-05T11:00:00Z"),
  },
];

// Chart colors
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: undefined,
    to: undefined,
  });

  // Filter bookings by date range
  const filteredBookings = useMemo(() => {
    return mockBookings.filter((booking) => {
      if (!dateRange.from || !dateRange.to) return true;
      const bookingDate = new Date(booking.startTime);
      return bookingDate >= dateRange.from && bookingDate <= dateRange.to;
    });
  }, [dateRange]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalRevenue = filteredBookings.reduce(
      (sum, b) => sum + (b.paymentStatus === "success" ? b.paymentAmount : 0),
      0
    );

    const totalBookings = filteredBookings.length;
    const completedBookings = filteredBookings.filter(
      (b) => b.status === "completed"
    ).length;
    const pendingPayments = filteredBookings.filter(
      (b) => b.paymentStatus === "pending"
    ).length;

    return {
      totalRevenue,
      totalBookings,
      completedBookings,
      pendingPayments,
    };
  }, [filteredBookings]);

  // Data for Users by Role chart
  const userRolesData = [
    { name: "Admin", value: 2 },
    { name: "Customer", value: 18 },
  ];

  // Data for Bookings Over Time chart
  const bookingsOverTime = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredBookings.forEach((b) => {
      const dateStr = b.startTime.toISOString().split("T")[0];
      grouped[dateStr] = (grouped[dateStr] || 0) + b.paymentAmount;
    });
    return Object.entries(grouped)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredBookings]);

  // Data for Booking Status chart
  const bookingStatusData = useMemo(() => {
    return [
      {
        name: "Pending",
        value: filteredBookings.filter((b) => b.status === "pending").length,
      },
      {
        name: "Confirmed",
        value: filteredBookings.filter((b) => b.status === "confirmed").length,
      },
      {
        name: "Completed",
        value: filteredBookings.filter((b) => b.status === "completed").length,
      },
      {
        name: "Cancelled",
        value: filteredBookings.filter((b) => b.status === "cancelled").length,
      },
    ];
  }, [filteredBookings]);

  // Data for Payment Status chart
  const paymentStatusData = useMemo(() => {
    return [
      {
        name: "Success",
        value: filteredBookings.filter((b) => b.paymentStatus === "success")
          .length,
      },
      {
        name: "Pending",
        value: filteredBookings.filter((b) => b.paymentStatus === "pending")
          .length,
      },
      {
        name: "Failed",
        value: filteredBookings.filter((b) => b.paymentStatus === "failed")
          .length,
      },
    ];
  }, [filteredBookings]);

  // Top Spaces table data
  const topSpacesData = useMemo(() => {
    const spaceCounts: Record<string, number> = {};
    filteredBookings.forEach((b) => {
      b.spaceNames.forEach((spaceName) => {
        spaceCounts[spaceName] = (spaceCounts[spaceName] || 0) + 1;
      });
    });
    return Object.entries(spaceCounts)
      .map(([name, count]) => ({ id: name, name, bookings: count }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  }, [filteredBookings]);

  const topSpacesColumns: Column<(typeof topSpacesData)[0]>[] = [
    { key: "name", label: "Space Name", sortable: true },
    { key: "bookings", label: "Total Bookings", sortable: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">
          View business metrics and performance data
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="flex gap-4 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {dateRange.from && dateRange.to
                ? `${dateRange.from.toLocaleDateString(
                    "vi-VN"
                  )} - ${dateRange.to.toLocaleDateString("vi-VN")}`
                : "Select Date Range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange as any}
              onSelect={(range) => setDateRange(range || {})}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {(dateRange.from || dateRange.to) && (
          <Button
            variant="ghost"
            onClick={() => setDateRange({ from: undefined, to: undefined })}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.completedBookings}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {metrics.pendingPayments}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Users by Role */}
        <Card>
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userRolesData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {userRolesData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bookings Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={bookingsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke={COLORS[0]} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Status */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {bookingStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {paymentStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Spaces Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Booked Spaces</CardTitle>
        </CardHeader>
        <CardContent>
          <GenericDataTable
            data={topSpacesData}
            columns={topSpacesColumns}
            actions={[]}
            pageSize={5}
          />
        </CardContent>
      </Card>
    </div>
  );
}

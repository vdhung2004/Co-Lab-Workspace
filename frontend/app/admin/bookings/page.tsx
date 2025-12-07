"use client";

import { useState } from "react";
import {
  Column,
  Action,
  GenericDataTable,
} from "@/components/admin/GenericDataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Mock Booking data matching Prisma Booking & Payment schema
 * TODO: Replace with API call to GET /api/bookings
 * Example: const response = await fetch('/api/bookings?status=pending&limit=100')
 */
type Booking = {
  id: string;
  bookerFullname: string | null;
  bookerEmail: string | null;
  bookerPhone: string | null;
  startTime: Date;
  endTime: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  spaceNames: string[]; // From BookingSpace join
  paymentAmount: number | null;
  paymentStatus: "pending" | "success" | "failed" | null;
  cancellationReason?: string | null;
  createdAt: Date;
};

const mockBookings: Booking[] = [
  {
    id: "booking-1",
    bookerFullname: "Nguyễn Trung Hiếu",
    bookerEmail: "hieu.nguyen@example.com",
    bookerPhone: "0901234567",
    startTime: new Date("2025-12-10T09:00:00Z"),
    endTime: new Date("2025-12-10T12:00:00Z"),
    status: "confirmed",
    spaceNames: ["Desk 1", "Room A"],
    paymentAmount: 150,
    paymentStatus: "success",
    createdAt: new Date("2025-12-08T10:30:00Z"),
  },
  {
    id: "booking-2",
    bookerFullname: "Trần Thị Lan",
    bookerEmail: "lan.tran@example.com",
    bookerPhone: "0912345678",
    startTime: new Date("2025-12-11T13:00:00Z"),
    endTime: new Date("2025-12-11T15:00:00Z"),
    status: "pending",
    spaceNames: ["Desk 2"],
    paymentAmount: 50,
    paymentStatus: "pending",
    createdAt: new Date("2025-12-08T14:15:00Z"),
  },
  {
    id: "booking-3",
    bookerFullname: "Phạm Văn Sơn",
    bookerEmail: "son.pham@example.com",
    bookerPhone: "0923456789",
    startTime: new Date("2025-12-12T10:00:00Z"),
    endTime: new Date("2025-12-12T11:30:00Z"),
    status: "completed",
    spaceNames: ["Conference Room"],
    paymentAmount: 100,
    paymentStatus: "success",
    createdAt: new Date("2025-12-05T11:00:00Z"),
  },
  {
    id: "booking-4",
    bookerFullname: "Lê Thị Hương",
    bookerEmail: "huong.le@example.com",
    bookerPhone: "0934567890",
    startTime: new Date("2025-12-13T14:00:00Z"),
    endTime: new Date("2025-12-13T16:00:00Z"),
    status: "cancelled",
    spaceNames: ["Meeting Room"],
    paymentAmount: 120,
    paymentStatus: "failed",
    cancellationReason: "Customer request",
    createdAt: new Date("2025-12-06T09:20:00Z"),
  },
];

export default function BookingsPage() {
  // State management for future API integration
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");
  const [paymentFilter, setPaymentFilter] = useState<
    "all" | "pending" | "success" | "failed"
  >("all");

  // Filtered data
  const filteredBookings = bookings.filter((booking) => {
    const statusMatch =
      statusFilter === "all" || booking.status === statusFilter;
    const paymentMatch =
      paymentFilter === "all" || booking.paymentStatus === paymentFilter;
    return statusMatch && paymentMatch;
  });

  // Column configuration
  const columns: Column<Booking>[] = [
    {
      key: "bookerFullname",
      label: "Booker",
      sortable: true,
      width: "w-40",
    },
    {
      key: "bookerEmail",
      label: "Email",
      sortable: true,
      width: "w-48",
    },
    {
      key: "spaceNames",
      label: "Spaces",
      render: (booking) => (
        <span className="text-sm">{booking.spaceNames.join(", ")}</span>
      ),
    },
    {
      key: "startTime",
      label: "Start Time",
      sortable: true,
      render: (booking) => booking.startTime.toLocaleString("vi-VN"),
    },
    {
      key: "endTime",
      label: "End Time",
      sortable: true,
      render: (booking) => booking.endTime.toLocaleString("vi-VN"),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (booking) => (
        <Badge
          variant={
            booking.status === "confirmed"
              ? "default"
              : booking.status === "pending"
              ? "secondary"
              : booking.status === "completed"
              ? "default"
              : "destructive"
          }
        >
          {booking.status}
        </Badge>
      ),
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (booking) => (
        <Badge
          variant={
            booking.paymentStatus === "success"
              ? "default"
              : booking.paymentStatus === "pending"
              ? "secondary"
              : "destructive"
          }
        >
          {booking.paymentAmount ? `$${booking.paymentAmount}` : "N/A"} (
          {booking.paymentStatus || "N/A"})
        </Badge>
      ),
    },
  ];

  // Row actions
  const actions: Action<Booking>[] = [
    {
      label: "View Details",
      onClick: (booking) => {
        // TODO: Show booking details modal
        // GET /api/bookings/{id}
        const details = `Booking ID: ${booking.id}\nBooker: ${
          booking.bookerFullname
        }\nEmail: ${booking.bookerEmail}\nSpaces: ${booking.spaceNames.join(
          ", "
        )}\nStart: ${booking.startTime.toLocaleString(
          "vi-VN"
        )}\nEnd: ${booking.endTime.toLocaleString("vi-VN")}\nStatus: ${
          booking.status
        }\nPayment: $${booking.paymentAmount} (${booking.paymentStatus})`;
        alert(details);
      },
    },
    {
      label: "Confirm",
      onClick: (booking) => {
        // TODO: Confirm pending booking
        // PATCH /api/bookings/{id}/confirm
        if (booking.status === "pending") {
          if (confirm(`Confirm booking for ${booking.bookerFullname}?`)) {
            alert(`Booking confirmed: ${booking.id}`);
          }
        } else {
          alert(`This booking is already ${booking.status}`);
        }
      },
    },
    {
      label: "Mark Complete",
      onClick: (booking) => {
        // TODO: Mark booking as completed
        // PATCH /api/bookings/{id}/complete
        if (booking.status === "confirmed") {
          if (confirm(`Mark booking as completed?`)) {
            alert(`Booking marked complete: ${booking.id}`);
          }
        } else {
          alert(`Only confirmed bookings can be marked complete`);
        }
      },
    },
    {
      label: "Cancel",
      onClick: (booking) => {
        // TODO: Show cancel reason dialog
        // PATCH /api/bookings/{id}/cancel with reason
        if (confirm(`Cancel booking for ${booking.bookerFullname}?`)) {
          const reason = prompt("Cancellation reason (optional):");
          alert(
            `Booking cancelled: ${booking.id}` +
              (reason ? `\nReason: ${reason}` : "")
          );
        }
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage and track all space reservations
          </p>
        </div>
        <Button>
          {/* TODO: Create new booking - POST /api/bookings */}
          New Booking
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 rounded-lg border bg-card flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Status:</label>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(
                value as
                  | "all"
                  | "pending"
                  | "confirmed"
                  | "completed"
                  | "cancelled"
              )
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Payment:</label>
          <Select
            value={paymentFilter}
            onValueChange={(value) =>
              setPaymentFilter(
                value as "all" | "pending" | "success" | "failed"
              )
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payment</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="text-sm text-muted-foreground ml-auto">
          {filteredBookings.length} result
          {filteredBookings.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Data Table */}
      <GenericDataTable
        data={filteredBookings}
        columns={columns}
        actions={actions}
        loading={loading}
        pageSize={10}
        searchableFields={["bookerFullname", "bookerEmail"]}
      />
    </div>
  );
}

"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BookingDetailModal } from "./booking-detail-modal";
import { getBookingsByUserAPI } from "@/services/bookings.service";
import { useAuth } from "@/context/auth.context";

export type BookingWithDetails = {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  cancellationReason?: string;
  spaces: {
    id: string;
    space: { id: string; name: string; location: string };
  }[];
  payment?: {
    provider: string;
    amount: number;
    status: string;
  };
};

export function BookingsTable() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getBookingsByUserAPI();
      console.log("Fetched bookings:", res);

      if (res.success) {
        console.log(res.bookings);
        setBookings(res.bookings || []);
      } else toast.error(res.message || "Lỗi lấy lịch sử đặt chỗ");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi mạng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy booking này?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Hủy booking thành công");
        fetchBookings();
      } else toast.error(data.message || "Hủy thất bại");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi mạng");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border">
        <thead className="bg-muted">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Ngày/Thời gian</th>
            <th className="p-2">Dịch vụ</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Thanh toán</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="p-2">{b.id}</td>
              <td className="p-2">
                {new Date(b.startTime).toLocaleString()} -{" "}
                {new Date(b.endTime).toLocaleTimeString()}
              </td>
              <td className="p-2">
                {b.spaces.map((s: any) => s.space.name).join(", ")}
              </td>
              <td className="p-2">{b.status}</td>
              <td className="p-2">
                {b.payment
                  ? `${b.payment.status} (${b.payment.amount} ₫)`
                  : "Chưa thanh toán"}
              </td>
              <td className="p-2 flex gap-2 flex-wrap">
                <BookingDetailModal booking={b} />
                {!b.payment && <Button size="sm">Thanh toán</Button>}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleCancelBooking(b.id)}
                >
                  Hủy booking
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p className="text-center mt-4">Đang tải...</p>}
    </div>
  );
}

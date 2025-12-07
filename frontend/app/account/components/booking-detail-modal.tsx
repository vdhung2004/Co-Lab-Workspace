"use client";

import * as React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { BookingWithDetails } from "./bookings-table";

interface BookingDetailModalProps {
  booking: BookingWithDetails;
}

export function BookingDetailModal({ booking }: BookingDetailModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Xem chi tiết
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Chi tiết booking</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về booking ID: {booking.id}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <div>
            <p className="font-medium">Thời gian:</p>
            <p>
              {new Date(booking.startTime).toLocaleString()} -{" "}
              {new Date(booking.endTime).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="font-medium">Trạng thái:</p>
            <p>{booking.status}</p>
          </div>

          <div>
            <p className="font-medium">Không gian đã đặt:</p>
            <ul className="list-disc ml-5">
              {booking.spaces.map((s: any) => (
                <li key={s.id}>
                  {s.space.name} - {s.space.location}
                </li>
              ))}
            </ul>
          </div>

          {booking.payment && (
            <div>
              <p className="font-medium">Thanh toán:</p>
              <p>
                {booking.payment.provider} - {booking.payment.status} -{" "}
                {booking.payment.amount} ₫
              </p>
            </div>
          )}

          {booking.payment?.status === "refunded" && (
            <div>
              <p className="font-medium text-red-600">Refunded</p>
            </div>
          )}

          {booking.cancellationReason && (
            <div>
              <p className="font-medium text-red-600">Lý do hủy:</p>
              <p>{booking.cancellationReason}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

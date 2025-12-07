"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// ========================================
// MOCK DATA — Replace bằng API sau
// ========================================
const mockBookings = Array.from({ length: 28 }).map((_, i) => ({
  id: `BK${1000 + i}`,
  startTime: "2025-03-21 09:00",
  endTime: "2025-03-21 12:00",
  status:
    i % 4 === 0
      ? "pending"
      : i % 4 === 1
      ? "confirmed"
      : i % 4 === 2
      ? "completed"
      : "cancelled",
  payment: {
    status: i % 3 === 0 ? "pending" : i % 3 === 1 ? "success" : "failed",
    amount: 150000 + i * 20000,
    provider: "momo",
  },
  workspace: "CoWork Hub Đà Nẵng",
  spaces: ["Tầng 3 - Bàn 12", "Tầng 4 - Meeting Room 2"],
}));

// ========================================
// COMPONENT
// ========================================
export default function BookingList() {
  const [visibleCount, setVisibleCount] = useState(10);
  const [selected, setSelected] = useState<any | null>(null);
  const [canceling, setCanceling] = useState<any | null>(null);

  const dataToShow = mockBookings.slice(0, visibleCount);

  // Status UI
  const renderBookingStatus = (status: string) => {
    const map: any = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return <Badge className={map[status]}>{status}</Badge>;
  };

  const renderPaymentStatus = (status: string) => {
    const map: any = {
      pending: "bg-orange-100 text-orange-700",
      success: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
    };
    return <Badge className={map[status]}>{status}</Badge>;
  };

  const formatPrice = (n: number) => n.toLocaleString("vi-VN") + "₫";

  return (
    <div>
      {/* ============================= */}
      {/* TABLE */}
      {/* ============================= */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Không gian</TableHead>
              <TableHead>Trạng thái đơn</TableHead>
              <TableHead>Trạng thái thanh toán</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {dataToShow.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.id}</TableCell>

                <TableCell>
                  {b.startTime} → {b.endTime}
                </TableCell>

                <TableCell>
                  <p className="font-semibold">{b.workspace}</p>
                  <ul className="text-sm text-gray-500">
                    {b.spaces.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </TableCell>

                <TableCell>{renderBookingStatus(b.status)}</TableCell>

                <TableCell>{renderPaymentStatus(b.payment.status)}</TableCell>

                <TableCell>{formatPrice(b.payment.amount)}</TableCell>

                <TableCell className="text-right space-x-2">
                  {/* Chi tiết */}
                  <Button variant="outline" onClick={() => setSelected(b)}>
                    Chi tiết
                  </Button>

                  {/* Thanh toán */}
                  {b.payment.status === "pending" &&
                    b.status !== "cancelled" &&
                    b.status !== "completed" && (
                      <Button onClick={() => toast.info("Đi đến thanh toán…")}>
                        Thanh toán
                      </Button>
                    )}

                  {/* Hủy */}
                  {(b.status === "pending" || b.status === "confirmed") && (
                    <Button
                      variant="destructive"
                      onClick={() => setCanceling(b)}
                    >
                      Hủy
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ======================== */}
      {/* LOAD MORE BUTTON */}
      {/* ======================== */}
      {visibleCount < mockBookings.length && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((prev) => prev + 10)}
          >
            Xem thêm (+10)
          </Button>
        </div>
      )}

      {/* ============================= */}
      {/* DETAIL DIALOG */}
      {/* ============================= */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết đơn {selected?.id}</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-3 text-sm">
              <p>
                <strong>Thời gian:</strong> {selected.startTime} →{" "}
                {selected.endTime}
              </p>

              <p>
                <strong>Không gian:</strong> {selected.workspace}
              </p>

              <ul>
                {selected.spaces.map((s: any) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>

              <p>
                <strong>Trạng thái đơn:</strong>{" "}
                {renderBookingStatus(selected.status)}
              </p>

              <p>
                <strong>Trạng thái thanh toán:</strong>{" "}
                {renderPaymentStatus(selected.payment.status)}
              </p>

              <p>
                <strong>Số tiền:</strong> {formatPrice(selected.payment.amount)}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setSelected(null)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================= */}
      {/* CANCEL DIALOG */}
      {/* ============================= */}
      <Dialog open={!!canceling} onOpenChange={() => setCanceling(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy đơn {canceling?.id}</DialogTitle>
          </DialogHeader>

          <p>Bạn có chắc muốn hủy đơn này không?</p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCanceling(null)}>
              Không
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                toast.success("Hủy đơn thành công");
                setCanceling(null);
              }}
            >
              Hủy đơn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

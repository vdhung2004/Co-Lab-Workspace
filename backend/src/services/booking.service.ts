// src/services/booking.service.ts
import { prisma } from "../lib/prisma";
import { BookingStatus } from "../generated/prisma/client";

export const BookingService = {
  // LẤY DANH SÁCH BOOKING
  getAll: async ({ page = 1, limit = 10, status }: any) => {
    const where: any = {};
    if (status) where.status = status;

    const total = await prisma.booking.count({ where });

    const data = await prisma.booking.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        spaces: { include: { space: true } },
        payment: true,
      },
    });

    return { total, page, limit, data };
  },

  // LẤY CHI TIẾT
  getById: async (id: string) => {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        spaces: { include: { space: true } },
        payment: true,
      },
    });

    if (!booking) throw { status: 404, message: "Booking không tồn tại" };
    return booking;
  },

  // TẠO BOOKING
  create: async (body: any) => {
    const {
      userId,
      bookerEmail,
      bookerFullname,
      bookerPhone,
      startTime,
      endTime,
      spaceIds,
    } = body;

    // 1. Kiểm tra trùng giờ
    for (const spaceId of spaceIds) {
      const conflict = await prisma.booking.findFirst({
        where: {
          OR: [
            {
              startTime: { lte: endTime },
              endTime: { gte: startTime },
            },
          ],
          spaces: { some: { spaceId } },
          status: { in: ["pending", "confirmed"] },
        },
      });

      if (conflict) {
        throw {
          status: 400,
          message: `Space ${spaceId} đã có booking trùng thời gian`,
        };
      }
    }

    // 2. Tạo booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        bookerEmail,
        bookerFullname,
        bookerPhone,
        startTime,
        endTime,
        status: "pending",
        spaces: {
          create: spaceIds.map((sid: string) => ({
            spaceId: sid,
            status: "pending",
          })),
        },
      },
      include: {
        spaces: true,
      },
    });

    return booking;
  },

  // CẬP NHẬT TRẠNG THÁI
  update: async (id: string, data: any) => {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!booking) throw { status: 404, message: "Booking không tồn tại" };

    // Không cho sửa booking đã hoàn thành hoặc hủy
    if (booking.status === "completed" || booking.status === "cancelled") {
      throw { status: 400, message: "Booking này không thể chỉnh sửa" };
    }

    // Nếu muốn cancel nhưng booking đã thanh toán → cần refund trước (giao Payment module)
    if (data.status === "cancelled" && booking.payment?.status === "success") {
      throw {
        status: 400,
        message: "Booking đã thanh toán, cần hoàn tiền trước khi hủy",
      };
    }

    return prisma.booking.update({
      where: { id },
      data,
      include: {
        spaces: true,
        payment: true,
      },
    });
  },

  // HỦY BOOKING
  cancel: async (id: string, reason: string) => {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!booking) throw { status: 404, message: "Booking không tồn tại" };

    // Nếu đã thanh toán thì để Payment + Refund xử lý
    if (booking.payment?.status === "success") {
      throw {
        status: 400,
        message: "Booking đã thanh toán, cần hoàn tiền trước khi hủy",
      };
    }

    return prisma.booking.update({
      where: { id },
      data: {
        status: "cancelled",
        cancellationReason: reason,
      },
    });
  },
};

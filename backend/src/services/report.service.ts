import { prisma } from "../lib/prisma";

interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  workspaceId?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

export const ReportService = {
  // 1️⃣ Booking tổng quan phân trang, lọc, sắp xếp
  getBookings: async (options: PaginationOptions = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      status,
      workspaceId,
      userId,
      startDate,
      endDate,
    } = options;

    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (workspaceId) {
      where.spaces = { some: { space: { workspaceId } } };
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const total = await prisma.booking.count({ where });

    const bookings = await prisma.booking.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: { spaces: { include: { space: true } }, payment: true },
    });

    return { total, page, limit, bookings };
  },

  // 2️⃣ Doanh thu theo khoảng thời gian phân trang
  getRevenue: async (options: PaginationOptions = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      startDate,
      endDate,
    } = options;
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const total = await prisma.payment.count({ where });

    const payments = await prisma.payment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    return { total, page, limit, totalRevenue, payments };
  },

  // 3️⃣ Refund tổng quan phân trang
  getRefunds: async (options: PaginationOptions = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      status,
    } = options;

    const where: any = {};
    if (status) where.status = status;

    const total = await prisma.refund.count({ where });

    const refunds = await prisma.refund.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: { payment: true, adminProcessor: true },
    });

    return { total, page, limit, refunds };
  },
};

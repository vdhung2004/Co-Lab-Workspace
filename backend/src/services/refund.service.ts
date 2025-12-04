import { prisma } from "../lib/prisma";

export const RefundService = {
  getAll: async ({ page = 1, limit = 10, status }: any) => {
    const where: any = {};
    if (status) where.status = status;

    const total = await prisma.refund.count({ where });
    const data = await prisma.refund.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { payment: true, adminProcessor: true },
    });

    return { total, page, limit, data };
  },

  getById: async (id: string) => {
    const refund = await prisma.refund.findUnique({
      where: { id },
      include: { payment: true, adminProcessor: true },
    });
    if (!refund) throw { status: 404, message: "Refund không tồn tại" };
    return refund;
  },

  create: async (body: any, adminId: string) => {
    const { paymentId, refundAmount, reason } = body;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!payment) throw { status: 404, message: "Payment không tồn tại" };
    if (payment.status !== "success")
      throw { status: 400, message: "Chưa thanh toán, không thể refund" };

    const refundRate = Math.round(
      (refundAmount / Number(payment.amount)) * 100
    );

    const refund = await prisma.refund.create({
      data: {
        paymentId,
        processedBy: adminId,
        refundAmount,
        refundRate,
        reason,
        status: "pending",
      },
    });

    // Nếu muốn tự động refund Momo, có thể gọi Momo API ở đây

    return refund;
  },

  updateStatus: async (
    id: string,
    status: "pending" | "success" | "failed"
  ) => {
    const refund = await prisma.refund.findUnique({ where: { id } });
    if (!refund) throw { status: 404, message: "Refund không tồn tại" };

    return prisma.refund.update({
      where: { id },
      data: { status },
    });
  },
};

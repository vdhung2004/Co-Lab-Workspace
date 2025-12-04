import { prisma } from "../lib/prisma";
import { PaymentStatus } from "../generated/prisma/client";
import { momoPayment } from "../utils/momo";

export const PaymentService = {
  getAll: async ({ page = 1, limit = 10, status }: any) => {
    const where: any = {};
    if (status) where.status = status;

    const total = await prisma.payment.count({ where });

    const data = await prisma.payment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { booking: true, refund: true },
    });

    return { total, page, limit, data };
  },

  getById: async (id: string) => {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { booking: true, refund: true },
    });
    if (!payment) throw { status: 404, message: "Payment không tồn tại" };
    return payment;
  },

  create: async (body: any) => {
    const { bookingId, provider, amount } = body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw { status: 404, message: "Booking không tồn tại" };

    // Kiểm tra đã thanh toán chưa
    const existing = await prisma.payment.findUnique({ where: { bookingId } });
    if (existing) throw { status: 400, message: "Booking đã có payment" };

    // Tạo payment pending
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        provider,
        amount,
        status: "pending",
      },
    });

    if (provider === "momo") {
      // gọi API Momo
      const payUrl = await momoPayment({
        amount,
        orderId: payment.id,
        orderInfo: `Booking ${bookingId}`,
        returnUrl: `${process.env.APP_URL}/payment-return`,
        notifyUrl: `${process.env.APP_URL}/api/payment/notify`,
      });

      return { ...payment, momoUrl: payUrl.payUrl };
    }

    return payment;
  },

  updateStatus: async (id: string, status: string) => {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) throw { status: 404, message: "Payment không tồn tại" };

    return prisma.payment.update({
      where: { id },
      data: { status: status as PaymentStatus },
    });
  },
};

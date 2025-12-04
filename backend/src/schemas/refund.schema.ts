import { z } from "zod";

export const createRefundSchema = z.object({
  body: z.object({
    paymentId: z.string().uuid(),
    refundAmount: z.number().positive("Số tiền hoàn phải lớn hơn 0"),
    reason: z.string().min(5, "Cần lý do hoàn tiền"),
  }),
});

export const updateRefundSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "success", "failed"]),
  }),
});

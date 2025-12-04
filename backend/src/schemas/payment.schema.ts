import { z } from "zod";

export const createPaymentSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid(),
    provider: z.enum(["momo", "cash"]),
    amount: z.number().positive("Số tiền phải lớn hơn 0"),
    transactionCode: z.string().optional(), // nếu momo
  }),
});

export const updatePaymentSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "success", "failed"]).optional(),
  }),
});

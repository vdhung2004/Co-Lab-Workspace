import { z } from "zod";

export const createBookingSchema = z.object({
  body: z.object({
    userId: z.string().uuid().optional(), // nếu user đã đăng nhập thì tự fill
    bookerFullname: z.string().min(2),
    bookerPhone: z.string().min(9),
    bookerEmail: z.string().email(),

    startTime: z.string().datetime(),
    endTime: z.string().datetime(),

    spaceIds: z.array(z.string().uuid()).min(1, "Phải chọn ít nhất 1 space"),
  }),
});

export const updateBookingSchema = z.object({
  body: z.object({
    status: z
      .enum(["pending", "confirmed", "completed", "cancelled"])
      .optional(),
    cancellationReason: z.string().optional(),
  }),
});

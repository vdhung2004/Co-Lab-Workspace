import { z } from "zod";

const phoneRegex = /^(?:\+84|0)\d{9,10}$/;

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(3, { message: "Họ và tên phải từ 3 ký tự trở lên" })
      .max(100)
      .optional(),
    phone: z
      .string()
      .regex(phoneRegex, { message: "Số điện thoại không hợp lệ" })
      .optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(8, { message: "Mật khẩu hiện tại phải từ 8 ký tự trở lên" })
      .nonempty("Mật khẩu hiện tại không được để trống"),
    newPassword: z
      .string()
      .min(8, { message: "Mật khẩu mới phải từ 8 ký tự trở lên" })
      .max(100, { message: "Mật khẩu không quá 100 ký tự" })
      .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ hoa" })
      .regex(/[a-z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ thường" })
      .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ số" })
      .regex(/[\W_]/, {
        message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
      })
      .nonempty("Mật khẩu mới không được để trống"),
  }),
});

export type IUpdateProfile = z.infer<typeof updateProfileSchema>["body"];
export type IChangePassword = z.infer<typeof changePasswordSchema>["body"];

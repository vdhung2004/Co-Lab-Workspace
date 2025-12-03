import { z } from "zod";

const phoneRegex = /^(?:\+84|0)\d{9,10}$/;

export const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(3, { message: "Họ và tên phải từ 3 ký tự trở lên" })
      .max(100),
    email: z.string().email({ message: "Email không hợp lệ" }),
    phone: z
      .string()
      .regex(phoneRegex, { message: "Số điện thoại không hợp lệ" }),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải từ 8 ký tự trở lên" })
      .max(100, { message: "Mật khẩu không quá 100 ký tự" })
      .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ hoa" })
      .regex(/[a-z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ thường" })
      .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ số" })
      .regex(/[\W_]/, {
        message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
      }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z.string().min(1, { message: "Mật khẩu không được để trống" }),
  }),
});

export const sendPasswordResetEmailSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    newPassword: z
      .string()
      .min(8, { message: "Mật khẩu phải từ 8 ký tự trở lên" })
      .max(100, { message: "Mật khẩu không quá 100 ký tự" })
      .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ hoa" })
      .regex(/[a-z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ thường" })
      .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ số" })
      .regex(/[\W_]/, {
        message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
      }),
  }),
});

export type IRegister = z.infer<typeof registerSchema>["body"];
export type ILogin = z.infer<typeof loginSchema>["body"];
export type ISendPasswordResetEmail = z.infer<
  typeof sendPasswordResetEmailSchema
>["body"];
export type IResetPassword = z.infer<typeof resetPasswordSchema>["body"];

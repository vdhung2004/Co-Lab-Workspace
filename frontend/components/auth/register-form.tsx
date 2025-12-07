"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { registerAPI } from "@/services/auth.service";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";

const phoneRegex = /^(?:\+84|0)\d{9,10}$/;

const registerSchema = z
  .object({
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

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormType = z.infer<typeof registerSchema>;
// ------------------------------------------------------------

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormType) {
    if (loading) return;

    setLoading(true);
    // call api register
    const [result] = await Promise.all([
      registerAPI(values),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]);

    setLoading(false);

    if (result.success) {
      console.log("Đăng ký thành công:", result.user);
      toast.success(result.message || "Đăng ký thành công!");
    } else {
      console.log("Lỗi đăng ký:", result.message);
      toast.error("Đăng ký thất bại: " + result.message);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
            <p className="text-sm text-muted-foreground">
              Nhập thông tin để đăng ký tài khoản
            </p>
          </div>

          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input placeholder="Nguyễn Văn A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="0123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhập lại mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                Đang đăng ký...
              </span>
            ) : (
              "Đăng ký"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link className="hover:underline" href="/login">
              Đăng nhập
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;

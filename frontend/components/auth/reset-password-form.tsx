"use client";

import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import {
  resetPasswordAPI,
  ResetPasswordRequest,
} from "@/services/auth.service"; // FE service

// ---------------- MATCH BACKEND SCHEMA ----------------
const resetPasswordSchema = z
  .object({
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

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;
// -------------------------------------------------------

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormType) {
    if (!token) {
      toast.error("Token không hợp lệ, vui lòng kiểm tra lại email.");
      return;
    }
    const data: ResetPasswordRequest = {
      newPassword: values.newPassword,
      token,
    };

    if (loading) return;
    setLoading(true);

    try {
      const [res] = await Promise.all([
        resetPasswordAPI(data),
        new Promise((resolve) => setTimeout(resolve, 1000)), // fake loading 1s
      ]);

      setLoading(false);

      if (res.success) {
        toast.success("Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay.");
        form.reset();
        router.push("/login");
      } else {
        toast.error(res.message || "Đổi mật khẩu thất bại.");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      console.error(err);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
            <p className="text-muted-foreground text-sm">
              Nhập mật khẩu mới để hoàn tất đặt lại.
            </p>
          </div>

          {!token && (
            <p className="text-red-500 text-sm text-center">
              Token không tồn tại. Hãy kiểm tra lại email của bạn.
            </p>
          )}

          {/* New Password */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu mới"
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

          {/* Submit Button */}
          <Button className="w-full" type="submit" disabled={!token || loading}>
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                Đang cập nhật...
              </span>
            ) : (
              "Đổi mật khẩu"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Quay lại trang{" "}
            <Link href="/login" className="hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;

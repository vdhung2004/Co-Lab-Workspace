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
import { useState } from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { sendForgotPasswordEmailAPI } from "@/services/auth.service"; // FE service

// ---------------- MATCH BACKEND SCHEMA ----------------
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
});

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;
// -------------------------------------------------------

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormType) {
    if (loading) return;

    setLoading(true);

    try {
      const [res] = await Promise.all([
        sendForgotPasswordEmailAPI(values.email),
        new Promise((resolve) => setTimeout(resolve, 1000)), // fake loading
      ]);

      setLoading(false);

      if (res.success) {
        toast.success(
          "Liên kết đặt lại mật khẩu đã được gửi tới email của bạn!"
        );
        form.reset();
      } else {
        toast.error(res.message || "Gửi yêu cầu thất bại");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
      console.error(err);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
            <p className="text-muted-foreground text-sm">
              Nhập email để nhận liên kết đặt lại mật khẩu
            </p>
          </div>

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

          {/* Button */}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                Đang gửi...
              </span>
            ) : (
              "Gửi yêu cầu"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Nhớ mật khẩu?{" "}
            <Link href="/login" className="hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;

"use client";

import * as React from "react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { Loader2Icon } from "lucide-react";
import { changePasswordAPI } from "@/services/user.service";

// ------------------ VALIDATION -------------------
const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Mật khẩu hiện tại không được để trống" }),
    newPassword: z
      .string()
      .min(8, { message: "Mật khẩu mới phải từ 8 ký tự trở lên" })
      .max(100, { message: "Mật khẩu không quá 100 ký tự" })
      .regex(/[A-Z]/, { message: "Phải chứa ít nhất 1 chữ hoa" })
      .regex(/[a-z]/, { message: "Phải chứa ít nhất 1 chữ thường" })
      .regex(/[0-9]/, { message: "Phải chứa ít nhất 1 chữ số" })
      .regex(/[\W_]/, { message: "Phải chứa ít nhất 1 ký tự đặc biệt" }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;

// ------------------ COMPONENT -------------------
export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(values: ChangePasswordFormType) {
    if (loading) return;
    setLoading(true);

    try {
      const { success, message } = await changePasswordAPI({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (success) {
        toast.success(message || "Đổi mật khẩu thành công!");
        form.reset();
      } else {
        toast.error(message || "Đổi mật khẩu thất bại");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Current Password */}
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu hiện tại</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Nhập mật khẩu hiện tại"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {/* Confirm New Password */}
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhập lại mật khẩu mới</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              Đang lưu...
            </span>
          ) : (
            "Đổi mật khẩu"
          )}
        </Button>
      </form>
    </Form>
  );
}

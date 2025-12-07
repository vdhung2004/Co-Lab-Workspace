"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useAuth } from "@/context/auth.context";
import { useState } from "react";
import { updateProfileAPI } from "@/services/user.service";

// Schema validate
const profileSchema = z.object({
  fullName: z.string().min(3, "Họ tên phải từ 3 ký tự trở lên"),
  email: z.string().email("Email không hợp lệ"),
});

export type ProfileFormType = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (values: ProfileFormType) => {
    setLoading(true);
    try {
      const updatedUser = await updateProfileAPI(values); // gọi API BE
      if (updatedUser.success && updatedUser.user) {
        setUser(updatedUser.user); // cập nhật context
        toast.success("Cập nhật hồ sơ thành công!");
      } else {
        toast.error(updatedUser.message || "Cập nhật thất bại");
      }
    } catch (err: any) {
      toast.error(err?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ tên</FormLabel>
              <FormControl>
                <Input placeholder="Họ tên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Số điện thoại</FormLabel>
          <FormControl>
            <Input value={user?.phone || ""} />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Vai trò</FormLabel>
          <FormControl>
            <Input value={user?.role || ""} disabled />
          </FormControl>
        </FormItem>

        <Button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </form>
    </Form>
  );
}

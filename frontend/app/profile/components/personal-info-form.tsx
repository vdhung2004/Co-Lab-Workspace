"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const phoneRegex = /^(?:\+84|0)\d{9,10}$/;

const personalInfoSchema = z.object({
  fullName: z.string().min(3, "Tên tối thiểu 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ"),
});

export type PersonalInfoType = z.infer<typeof personalInfoSchema>;

export function PersonalInfoForm({ user }: { user: PersonalInfoType }) {
  const form = useForm<PersonalInfoType>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: user,
  });

  async function onSubmit(values: PersonalInfoType) {
    toast.success("Cập nhật thông tin thành công!");
  }

  return (
    <div className="max-w-lg">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Full name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập họ tên" />
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
                  <Input {...field} disabled />
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
                  <Input {...field} placeholder="Nhập số điện thoại" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Lưu thay đổi</Button>
        </form>
      </Form>
    </div>
  );
}

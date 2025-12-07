"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
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
import { loginAPI } from "@/services/auth.service";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống" }),
});

export type LoginFormType = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormType) {
    if (loading) return;
    setLoading(true);

    try {
      const [result] = await Promise.all([
        loginAPI(values),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      if (result.success && result.user) {
        setUser(result.user);
        toast.success("Đăng nhập thành công!");
        router.push("/"); // redirect
      } else {
        toast.error(result.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      toast.error("Lỗi mạng hoặc server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Đăng nhập</h1>
            <p className="text-sm text-muted-foreground">
              Nhập email và mật khẩu của bạn
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

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Mật khẩu</FormLabel>
                  <Link
                    className="text-sm text-muted-foreground hover:underline"
                    href="/forgot-password"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
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

          {/* Button */}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                Đang đăng nhập...
              </span>
            ) : (
              "Đăng nhập"
            )}
          </Button>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link className="hover:underline" href="/register">
              Đăng ký ngay
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;

"use client";

import { verifyEmailAPI } from "@/services/auth.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Link xác thực không hợp lệ.");
      router.replace("/login");
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyEmailAPI(token);
        if (res.success) {
          toast.success("Xác thực email thành công!");
          router.replace("/login");
        } else {
          toast.error(res.message || "Xác thực thất bại.");
        }
      } catch (err) {
        toast.error("Lỗi khi xác thực email.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams, router]);

  if (loading) return <p>Đang xác thực email...</p>;

  return <p>Đã xác thực xong!</p>;
};

export default VerifyEmailPage;

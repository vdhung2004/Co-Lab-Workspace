"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/20 border-t">
      <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* COMPANY INFO */}
        <div>
          <h2 className="text-lg font-bold mb-3">
            Công ty TNHH WorkHub Việt Nam
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Giải pháp không gian làm việc linh hoạt – đặt chỗ, phòng họp nhanh
            chóng.
          </p>

          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> Hotline:{" "}
              <span className="font-medium">0123 456 789</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email: support@workhub.vn
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Văn phòng: 123 Nguyễn Văn Linh, Q.7, TP. HCM
            </p>
          </div>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Dịch vụ</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/dich-vu/cho-ngoi" className="hover:underline">
                Chỗ ngồi làm việc
              </Link>
            </li>
            <li>
              <Link href="/dich-vu/phong-hop" className="hover:underline">
                Phòng họp
              </Link>
            </li>
            <li>
              <Link href="/dia-diem" className="hover:underline">
                Chuỗi địa điểm
              </Link>
            </li>
            <li>
              <Link href="/bang-gia" className="hover:underline">
                Bảng giá
              </Link>
            </li>
          </ul>
        </div>

        {/* SOCIAL CONNECTION */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Kết nối</h3>

          <div className="flex gap-4">
            <Link
              href="#"
              aria-label="Facebook"
              className="p-2 border rounded-md hover:bg-accent"
            >
              <Facebook className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              aria-label="Instagram"
              className="p-2 border rounded-md hover:bg-accent"
            >
              <Instagram className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              aria-label="LinkedIn"
              className="p-2 border rounded-md hover:bg-accent"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Đăng ký nhận tin</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Nhận ưu đãi & tin tức mới nhất mỗi tuần!
          </p>

          <div className="flex gap-2">
            <Input placeholder="Nhập email của bạn" />
            <Button>Gửi</Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* COPYRIGHT */}
      <div className="text-center text-sm text-muted-foreground py-4">
        © {new Date().getFullYear()} WorkHub Vietnam. All rights reserved.
      </div>
    </footer>
  );
}

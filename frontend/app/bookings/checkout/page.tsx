"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const searchParams = useSearchParams();

  // Lấy dữ liệu từ URL (hoặc từ state trong thực tế)
  const selectedDate = searchParams.get("date");
  const startTime = searchParams.get("start");
  const endTime = searchParams.get("end");
  const location = searchParams.get("location");
  const service = searchParams.get("service");

  // Danh sách bàn/phòng được chọn
  const selectedSpaces = JSON.parse(searchParams.get("spaces") || "[]") as {
    id: string;
    name: string;
    price: number;
  }[];

  const total = selectedSpaces.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="w-full max-w-6xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* LEFT: THÔNG TIN MÔ TẢ KHÔNG GIAN */}
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết không gian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative w-full h-64 rounded-md overflow-hidden bg-gray-200">
              <Image
                src="/placeholder-image.jpg"
                alt="Không gian"
                fill
                className="object-cover"
              />
            </div>

            <h2 className="text-2xl font-semibold">
              Không gian làm việc / Phòng họp
            </h2>

            <p className="text-muted-foreground">
              Đây là mô tả chi tiết của không gian: diện tích, số người phù hợp,
              tiện ích có sẵn, môi trường làm việc, điểm nổi bật và các hướng
              dẫn sử dụng.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">Ngày</p>
                  <p className="font-medium">{selectedDate}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">Thời gian</p>
                  <p className="font-medium">
                    {startTime} - {endTime}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">Địa điểm</p>
                  <p className="font-medium">{location}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">Dịch vụ</p>
                  <p className="font-medium">{service}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT: TÓM TẮT ĐẶT CHỖ */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt đặt chỗ</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <h3 className="font-medium">Không gian đã chọn:</h3>

            <div className="space-y-3">
              {selectedSpaces.map((space) => (
                <div
                  key={space.id}
                  className="flex justify-between border rounded-md p-3 text-sm"
                >
                  <span>{space.name}</span>
                  <span className="font-medium">
                    {space.price.toLocaleString()}đ
                  </span>
                </div>
              ))}
            </div>

            <hr />

            <div className="flex justify-between text-lg font-semibold">
              <span>Tổng cộng:</span>
              <span>{total.toLocaleString()}đ</span>
            </div>

            <Button className="w-full mt-4" size="lg">
              Đặt chỗ
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

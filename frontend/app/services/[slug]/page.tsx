"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const serviceData = {
  "cho-ngoi-lam-viec": {
    title: "Chỗ ngồi làm việc",
    desc: "Không gian làm việc yên tĩnh, tiện nghi, phù hợp cá nhân và nhóm nhỏ.",
    img: "/services/desk.jpg",
    price: "80.000đ / giờ",
    locations: [
      { id: 1, name: "Chi nhánh Quận 1" },
      { id: 2, name: "Chi nhánh Quận 3" },
    ],
  },
  "phong-hop": {
    title: "Phòng họp",
    desc: "Phòng họp 6–12 người, trang bị đầy đủ máy chiếu, bảng viết và âm thanh.",
    img: "/services/meeting-room.jpg",
    price: "200.000đ / giờ",
    locations: [
      { id: 1, name: "Chi nhánh Quận 1" },
      { id: 3, name: "Chi nhánh Thủ Đức" },
    ],
  },
};

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = serviceData[slug as keyof typeof serviceData];

  if (!service)
    return <p className="text-center py-10">Không tìm thấy dịch vụ.</p>;

  return (
    <div className="w-full max-w-5xl mx-auto py-10">
      {/* Header dịch vụ */}
      <h1 className="text-3xl font-bold mb-3">{service.title}</h1>
      <p className="text-gray-600 mb-6">{service.desc}</p>

      {/* Ảnh dịch vụ */}
      <div className="relative w-full h-64 mb-8">
        <Image
          src={service.img}
          alt={service.title}
          fill
          className="object-cover rounded-xl"
        />
      </div>

      {/* Giá */}
      <div className="mb-6">
        <p className="text-xl font-semibold">Giá: {service.price}</p>
      </div>

      {/* Danh sách chi nhánh hỗ trợ */}
      <h2 className="text-2xl font-bold mb-3">Chi nhánh hỗ trợ dịch vụ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {service.locations.map((loc) => (
          <Card key={loc.id}>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{loc.name}</h3>
              <Link href={`/locations/${loc.id}`}>
                <Button variant="outline" className="mt-3">
                  Xem chi tiết chi nhánh
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Button size="lg">Đặt dịch vụ</Button>
      </div>
    </div>
  );
}

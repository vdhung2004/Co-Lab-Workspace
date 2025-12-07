"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// Fake data ví dụ
const locationData = {
  1: {
    name: "Chi nhánh Quận 1",
    address: "123 Nguyễn Huệ, Q.1",
    description:
      "Không gian làm việc hiện đại nằm ngay trung tâm Quận 1, phù hợp làm việc nhóm và cá nhân.",
    services: [
      {
        id: 101,
        title: "Chỗ ngồi làm việc",
        desc: "Không gian yên tĩnh, đầy đủ tiện ích.",
        img: "/services/desk.jpg",
      },
      {
        id: 102,
        title: "Phòng họp",
        desc: "Phòng họp 6–10 người, có máy chiếu.",
        img: "/services/meeting-room.jpg",
      },
    ],
  },
  2: {
    name: "Chi nhánh Quận 3",
    address: "45 Võ Thị Sáu, Q.3",
    description:
      "Không gian ấm cúng, nhiều cây xanh, phù hợp freelancer và startup.",
    services: [
      {
        id: 201,
        title: "Chỗ ngồi làm việc",
        desc: "Không gian mở với ánh sáng tự nhiên.",
        img: "/services/desk.jpg",
      },
    ],
  },
  3: {
    name: "Chi nhánh Thủ Đức",
    address: "789 Phạm Văn Đồng",
    description: "Cơ sở rộng rãi, có nhiều phòng họp và không gian riêng tư.",
    services: [
      {
        id: 301,
        title: "Phòng họp",
        desc: "Phù hợp họp nhóm 4–12 người.",
        img: "/services/meeting-room.jpg",
      },
    ],
  },
};

export default function LocationDetailPage() {
  const { id } = useParams();
  const location = locationData[id as keyof typeof locationData];

  if (!location)
    return <p className="text-center py-10">Không tìm thấy địa điểm.</p>;

  return (
    <div className="w-full max-w-6xl mx-auto py-10">
      {/* Thông tin địa điểm */}
      <h1 className="text-3xl font-bold mb-2">{location.name}</h1>
      <p className="text-muted-foreground mb-4">{location.address}</p>
      <p className="text-base text-gray-600 mb-8">{location.description}</p>

      {/* Danh sách dịch vụ */}
      <h2 className="text-2xl font-bold mb-4">Dịch vụ tại địa điểm</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {location.services.map((svc) => (
          <Card key={svc.id}>
            <CardContent className="p-0">
              <div className="relative w-full h-48">
                <Image
                  src={svc.img}
                  alt={svc.title}
                  fill
                  className="object-cover rounded-t-xl"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{svc.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{svc.desc}</p>

                <Link href={`/services/${svc.id}`}>
                  <Button>Xem chi tiết dịch vụ</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

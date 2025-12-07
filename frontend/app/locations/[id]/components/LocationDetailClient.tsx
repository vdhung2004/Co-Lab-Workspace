"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LocationDetailClient({ location }: { location: any }) {
  const images = location.images || [];
  console.log("Location images:", images);

  return (
    <div className="w-full flex flex-col items-center pb-20">
      {/* === CAROUSEL ẢNH === */}
      <section className="w-full max-w-5xl mb-12">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((img: any) => (
              <CarouselItem key={img.id}>
                <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
                  <Image
                    src={img.url}
                    alt={location.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* === GRID INFO + MAP === */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* THÔNG TIN */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{location.name}</h1>
          <p className="text-gray-600">{location.address}</p>

          <p className="text-gray-700 leading-relaxed">
            {location.description}
          </p>

          <Button size="lg" className="mt-4">
            Đặt chỗ ngay
          </Button>
        </div>

        {/* MAP */}
        <div>
          <div className="w-full h-80 rounded-xl overflow-hidden shadow-sm">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              className="border-0"
              allowFullScreen
              src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&hl=vi&z=16&output=embed`}
            />
          </div>
        </div>
      </section>

      {/* === DỊCH VỤ === */}
      <section className="w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-6">Dịch vụ tại địa điểm</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DESK */}
          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-0">
              <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
                <Image
                  src="/services/desk.jpg"
                  alt="Chỗ ngồi làm việc"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Chỗ ngồi làm việc
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Không gian linh hoạt, yên tĩnh cho công việc hiệu quả.
                </p>

                <Button variant="outline">Xem chi tiết</Button>
              </div>
            </CardContent>
          </Card>

          {/* MEETING ROOM */}
          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-0">
              <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
                <Image
                  src="/services/meeting-room.jpg"
                  alt="Phòng họp"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Phòng họp</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Đầy đủ tiện nghi, phù hợp họp nhóm và hội thảo nhỏ.
                </p>

                <Button variant="outline">Xem chi tiết</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

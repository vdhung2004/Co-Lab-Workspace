"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { useState } from "react";

export default function HomeClient({ locationData }: any) {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-6xl py-10">
        <Carousel className="w-full rounded-xl">
          <CarouselContent>
            {locationData.images.map((img: any) => (
              <CarouselItem key={img.id}>
                <div className="relative w-full h-[420px]">
                  <Image
                    src={img.url}
                    alt="Ảnh không gian làm việc"
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

      {/* Quick Search */}
      <section className="w-full max-w-5xl mt-8 bg-white p-6 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select defaultValue={locationData.id}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn địa điểm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={locationData.id}>{locationData.name}</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Chọn dịch vụ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desk">Chỗ ngồi làm việc</SelectItem>
            <SelectItem value="room">Phòng họp</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full text-left font-normal">
              {date ? date.toLocaleDateString() : "Chọn ngày đặt"}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>

        <Button className="w-full">Tìm kiếm</Button>
      </section>

      {/* Features */}
      <section className="w-full max-w-6xl py-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {[
          {
            title: "Không gian linh hoạt",
            desc: "Nhiều loại không gian phù hợp mọi nhu cầu.",
          },
          {
            title: "Đặt chỗ nhanh",
            desc: "Chỉ vài thao tác là hoàn tất đặt chỗ.",
          },
          {
            title: "Hỗ trợ 24/7",
            desc: "Luôn sẵn sàng hỗ trợ bạn.",
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      {/* Hiển thị 1 địa điểm */}
      <section className="w-full max-w-6xl py-10">
        <h2 className="text-2xl font-bold mb-6">Dịch vụ</h2>
        <Card className="py-0 rounded-xl shadow-sm hover:shadow-md transition">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-56 md:h-full">
              <Image
                src={locationData.images?.[0]?.url || "/fallback.jpg"}
                alt={locationData.name}
                fill
                className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
              />
            </div>

            {/* Content */}
            <CardContent className="p-6 flex flex-col justify-center ">
              <h3 className="text-2xl font-semibold mb-2">
                {locationData.name}
              </h3>
              <p className="text-gray-500 mb-3">{locationData.address}</p>

              <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                {locationData.description}
              </p>

              <Button className="   w-full " variant="outline">
                Xem chi tiết
              </Button>
            </CardContent>
          </div>
        </Card>
      </section>

      {/* Services */}
      <section className="w-full max-w-6xl py-10">
        <h2 className="text-2xl font-bold mb-6">Dịch vụ</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Chỗ ngồi làm việc",
              desc: "Không gian linh hoạt, yên tĩnh cho công việc hiệu quả.",
              img: "/images/workspace/img_workspace1.jpg",
            },
            {
              title: "Phòng họp",
              desc: "Đầy đủ tiện nghi cho họp nhóm.",
              img: "/images/workspace/img_workspace2.jpg",
            },
          ].map((svc) => (
            <Card key={svc.title} className="pt-0">
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
                  <p className="text-gray-600 text-sm mb-4">{svc.desc}</p>
                  <Button>Chi tiết dịch vụ</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      {/* How It Works */}
      <section className="w-full max-w-6xl py-10">
        <h2 className="text-2xl font-bold mb-6">Quy trình đặt</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {["Chọn địa điểm", "Chọn dịch vụ", "Đặt chỗ & thanh toán"].map(
            (step, idx) => (
              <Card key={step}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Bước {idx + 1}</h3>
                  <p className="text-gray-600 text-sm">{step}</p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full max-w-6xl py-10">
        <h2 className="text-2xl font-bold mb-6">Khách hàng nói gì</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <p className="italic mb-2">
                  “Dịch vụ tuyệt vời, đặt chỗ rất nhanh!”
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-16 text-center bg-gray-100 mt-12">
        <h2 className="text-2xl font-bold mb-4">Sẵn sàng trải nghiệm?</h2>
        <Button size="lg">Đặt chỗ ngay</Button>
      </section>
    </div>
  );
}

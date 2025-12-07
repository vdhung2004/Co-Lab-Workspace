"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [price, setPrice] = useState<number[]>([200]);
  const [amenities, setAmenities] = useState<string[]>([]);

  const toggleAmenity = (value: string) => {
    setAmenities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Đặt phòng / bàn làm việc</h1>

      {/* ------------------- BỘ LỌC ------------------- */}
      <Card className="mb-10">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Địa điểm */}
          <div>
            <label className="font-medium text-sm">Địa điểm</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn địa điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q1">Quận 1</SelectItem>
                <SelectItem value="q3">Quận 3</SelectItem>
                <SelectItem value="td">Thủ Đức</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dịch vụ */}
          <div>
            <label className="font-medium text-sm">Dịch vụ</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn dịch vụ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desk">Chỗ ngồi làm việc</SelectItem>
                <SelectItem value="meeting">Phòng họp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ngày đặt */}
          <div>
            <label className="font-medium text-sm">Ngày</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  {date ? date.toLocaleDateString() : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Thời gian bắt đầu */}
          <div>
            <label className="font-medium text-sm">Bắt đầu</label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          {/* Thời gian kết thúc */}
          <div>
            <label className="font-medium text-sm">Kết thúc</label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          {/* Giá tối đa */}
          <div>
            <label className="font-medium text-sm">Giá tối đa (x1000đ)</label>
            <Slider value={price} max={500} onValueChange={setPrice} />
            <p className="text-sm text-muted-foreground mt-1">
              Tối đa: {price[0]}k
            </p>
          </div>

          {/* Tiện ích */}
          <div className="md:col-span-3">
            <label className="font-medium text-sm">Tiện ích</label>
            <ToggleGroup type="multiple" className="flex flex-wrap gap-2 mt-2">
              {[
                { value: "wifi", label: "WiFi" },
                { value: "parking", label: "Bãi xe" },
                { value: "projector", label: "Máy chiếu" },
                { value: "water", label: "Nước uống" },
                { value: "whiteboard", label: "Bảng viết" },
              ].map((item) => (
                <ToggleGroupItem
                  key={item.value}
                  value={item.value}
                  pressed={amenities.includes(item.value)}
                  onClick={() => toggleAmenity(item.value)}
                >
                  {item.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </CardContent>

        {/* Nút tìm kiếm */}
        <div className="p-6 border-t">
          <Button size="lg" className="w-full">
            Tìm kiếm
          </Button>
        </div>
      </Card>

      {/* ------------------- KẾT QUẢ HIỂN THỊ ------------------- */}
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="map">Sơ đồ phòng / bàn</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* -------- MAP VIEW (Visual Selection) -------- */}
        <TabsContent value="map">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sơ đồ không gian</h2>
              <div className="relative w-full h-96 bg-gray-200 rounded-md flex items-center justify-center">
                <p className="text-gray-600">Sơ đồ phòng / bàn (Image / SVG)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* -------- TIMELINE VIEW -------- */}
        <TabsContent value="timeline">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Timeline</h2>

              <div className="space-y-4">
                {[1, 2, 3].map((room) => (
                  <div key={room}>
                    <p className="font-medium mb-1">Phòng họp {room}</p>
                    <div className="h-12 bg-gray-100 rounded-md flex items-center pl-4">
                      <span className="text-sm text-gray-500">
                        Timeline đặt chỗ (block busy/free)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

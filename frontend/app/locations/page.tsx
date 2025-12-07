"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const locations = [
  {
    id: 1,
    name: "Chi nhánh Quận 1",
    address: "123 Nguyễn Huệ, Q.1",
  },
  {
    id: 2,
    name: "Chi nhánh Quận 3",
    address: "45 Võ Thị Sáu, Q.3",
  },
  {
    id: 3,
    name: "Chi nhánh Thủ Đức",
    address: "789 Phạm Văn Đồng, Thủ Đức",
  },
];

export default function LocationsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Danh sách địa điểm</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <Card key={loc.id}>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-1">{loc.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {loc.address}
              </p>

              <Link href={`/locations/${loc.id}`}>
                <Button className="w-full" variant="outline">
                  Xem chi tiết
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

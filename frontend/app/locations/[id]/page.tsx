// frontend/app/locations/[id]/page.tsx

import { notFound } from "next/navigation";
import LocationDetailClient from "./components/LocationDetailClient";

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Lỗi ở đây: Biến 'params' không còn tồn tại, chỉ còn 'id'
  // Sửa: console.log("Fetching location with id:", id);
  const { id } = await params;
  console.log("Fetching location with id:", id);
  const res = await fetch(
    // Tùy chọn: Dùng 'id' nếu API của bạn cần nó, nhưng API hiện tại là hardcoded
    // Ví dụ: `http://localhost:5000/api/location/${id}`
    `http://localhost:5000/api/workspace/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return notFound();

  const location = await res.json();

  return <LocationDetailClient location={location} />;
}

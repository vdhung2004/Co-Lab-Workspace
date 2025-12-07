// frontend/app/locations/[id]/page.tsx

import { notFound } from "next/navigation";

export default async function LocationDetailPage({
  params: { id }, // <--- Lấy ra biến 'id' từ 'params'
}: {
  params: { id: string };
}) {
  // Lỗi ở đây: Biến 'params' không còn tồn tại, chỉ còn 'id'
  // Sửa: console.log("Fetching location with id:", id);
  console.log("Fetching location with id:", id);

  const res = await fetch(
    // Tùy chọn: Dùng 'id' nếu API của bạn cần nó, nhưng API hiện tại là hardcoded
    // Ví dụ: `http://localhost:5000/api/location/${id}`
    `http://localhost:5000/api/workspace/089670f8-96aa-4f82-8fac-88cc6007d261`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return notFound();

  const location = await res.json();

  return <h1>{location.name}</h1>;
}

import React from 'react';

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
interface Floor {
  id: string;
  name: string;
  imageUrl?: string | null;
  width?: number | null;
  height?: number | null;
}

// Lấy biến môi trường cho URL API
const BASE_URL = process.env.BACKEND_API_URL || 'http://localhost:8000/api'; 

interface FloorPageProps {
  params: {
    workspaceId: string; // trùng với tên folder [workspaceId]
  };
}

// --- HÀM FETCH DỮ LIỆU ---
async function getFloors(workspaceId: string): Promise<Floor[]> {
  const API_URL = `http://localhost:8000/api/workspace/${workspaceId}/floors`;
  
  // Sử dụng fetch gốc của Node.js/Next.js
  const res = await fetch(API_URL, {
    // Tùy chọn: Để tránh cache trong môi trường dev
    cache: 'no-store', 
  });

  if (!res.ok) {
    // Xử lý lỗi HTTP (404, 500,...)
    console.error(`Lỗi khi fetch Floors: ${res.statusText}`);
    return []; 
  }

  // API trả về mảng Floor (giả định)
  return res.json();
}

// --- COMPONENT TRANG CHÍNH ---

const FloorPage = async ({params}: FloorPageProps) => {
  const {workspaceId} = await params;

  const floors = await getFloors(workspaceId);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Tầng (Floors) của Workspace ID: <span className="text-blue-600">{workspaceId}</span>
      </h1>
      {floors.length === 0 ? (
        <p className="text-gray-500 italic">Không tìm thấy Tầng nào cho Workspace này hoặc lỗi khi tải dữ liệu.</p>
      ) : (
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Tầng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bản đồ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kích thước (Rộng x Cao)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {floors.map((floor) => (
                <tr key={floor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{floor.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {floor.imageUrl ? 'Có' : 'Không'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {floor.width && floor.height ? `${floor.width} x ${floor.height}` : 'Chưa định nghĩa'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FloorPage;
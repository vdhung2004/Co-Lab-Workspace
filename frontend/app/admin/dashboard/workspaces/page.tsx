import Link from "next/link";

type Workspace = {
  id: string;
  name: string;
  address: string;
  status: string;
  floors?: Floor[]; // hoặc khai báo kỹ hơn nếu muốn
};

export type Floor = {
  id: string;
  workspaceId: string;
  name: string;
  imageUrl?: string | null;
  width?: number | null;
  height?: number | null;
  createdAt: string;
  spaces?: Space[]; // bạn muốn thêm Space thì khai báo sau
};

export type Space = {
  id: string;
  floorId: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string; // chair, meeting-room, desk...
  status: string;
  createdAt: string;
};

// 🟦 Server Component — gọi API và lấy dữ liệu thật
async function getWorkspaces() {
  const res = await fetch(`http://localhost:8000/api/workspace`, {
    method: "GET",
    cache: "no-store", // luôn fetch mới
  });

  if (!res.ok) {
    throw new Error("Failed to fetch workspaces");
  }

  return res.json();
}

export default async function WorkspaceList() {
  const data = await getWorkspaces();
  const workspaces: Workspace[] = data.workspaces || [];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Danh Sách Workspaces</h1>

      <div className="shadow border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên Workspace
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {workspaces.map((ws) => (
              <tr key={ws.id} className="hover:bg-blue-50 transition duration-150">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {ws.name}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ws.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {ws.status}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/dashboard/workspaces/${ws.id}/floors`}
                    className="text-blue-600 hover:text-blue-900 font-semibold"
                  >
                    Xem Floors
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

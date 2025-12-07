"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

// 1. IMPORT MODAL
import UserEditModal from "./userEditModal";

// TYPES KHỚP VỚI MODAL
type Role = "admin" | "customer";
type Status = "active" | "locked";

// --- API TYPES ---
interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string; // 'admin' | 'customer'
  status: string; // 'active' | 'locked'
  verified: boolean;
  createdAt: string;
}

interface ApiResponse {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  users: ApiUser[];
}

const API_URL =
  "http://localhost:8000/api/users?page=1&limit=5&sortBy=email&order=asc";

const SimpleUserTable: React.FC = () => {
  const [usersData, setUsersData] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState<ApiUser | null>(
    null
  );

  // --- Fetch Users ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(API_URL);
      setUsersData(response.data.users);
    } catch (error) {
      console.error("Lỗi tải user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Mở Modal ---
  const handleEditClick = (user: ApiUser) => {
    console.log("👉 User được chọn:", user);
    setCurrentUserToEdit(user);
    setIsModalOpen(true);
  };

  // --- Save từ Modal ---
  const handleSaveUser = async (newRole: Role, newStatus: Status) => {
    console.log("Gửi API với ID:", currentUserToEdit!.id);
  if (!currentUserToEdit) return;

  const apiStatus = newStatus === "active" ? "active" : "locked";

  try {
    // CALL API UPDATE
    await axios.put(`http://localhost:8000/api/users/${currentUserToEdit.id}`, {
      role: newRole,
      status: apiStatus,
    });

    // Cập nhật UI local
    setUsersData(prev =>
      prev.map(u =>
        u.id === currentUserToEdit.id
          ? {
              ...u,
              role: newRole,
              status: apiStatus,
            }
          : u
      )
    );

    console.log("Cập nhật thành công!");

  } catch (err) {
    console.error("Lỗi update user:", err);
    alert("Lỗi cập nhật người dùng!");
  }

  setIsModalOpen(false);
  setCurrentUserToEdit(null);
};

  if (loading) {
    return (
      <div className="p-5 max-w-4xl mx-auto text-center text-lg font-semibold text-blue-500">
        Đang tải dữ liệu... 🔄
      </div>
    );
  }

  return (
    <div className="p-5 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📋 Danh Sách Người Dùng</h2>

      <table className="min-w-full border border-gray-200 divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs">ID</th>
            <th className="px-6 py-3 text-left text-xs">Tên</th>
            <th className="px-6 py-3 text-left text-xs">Email</th>
            <th className="px-6 py-3 text-left text-xs">Vai trò</th>
            <th className="px-6 py-3 text-left text-xs">Trạng thái</th>
            <th className="px-6 py-3 text-left text-xs">Xác thực</th>
            <th className="px-6 py-3 text-left text-xs">Ngày tạo</th>
            <th className="px-6 py-3 text-left text-xs">Chức năng</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {usersData.map((user) => (
            <tr key={user.id} className="hover:bg-blue-50">
              <td className="px-6 py-4 text-xs font-mono">{user.id}</td>
              <td className="px-6 py-4 text-sm">{user.fullName}</td>
              <td className="px-6 py-4 text-sm">{user.email}</td>
              <td className="px-6 py-4 text-sm font-semibold text-blue-700">
                {user.role}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-semibold ${
                    user.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold">
                {user.verified ? "True" : "False"}
              </td>
              <td className="px-6 py-4 text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td>
                <button
                  onClick={() => handleEditClick(user)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm"
                >
                  Chỉnh sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL POPUP */}
      {currentUserToEdit && (
        <UserEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialRole={currentUserToEdit.role as Role}
          initialStatus={currentUserToEdit.status as Status}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default SimpleUserTable;

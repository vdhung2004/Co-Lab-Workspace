"use client"; // Thêm dòng này nếu bạn đang dùng App Router của Next.js

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Booking } from '@/lib/types/booking';

const API_URL = "http://localhost:8000/api/booking"; // Địa chỉ API của bạn

const BookingTable: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Fetch dữ liệu từ API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        // Giả sử API trả về đối tượng { data: [...] }
        setBookings(result.data || []);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Hàm tiện ích để format ngày giờ
  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 3. Hiển thị trạng thái tải và lỗi
  if (loading) return <p className="text-center p-4">Đang tải dữ liệu...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 p-4">Lỗi tải dữ liệu: {error}</p>
    );

  // 4. Render Table (Tailwind CSS)
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Danh Sách Đặt Chỗ
      </h1>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Tiêu đề Bảng */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã Đặt Chỗ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người Đặt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email/SĐT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời Gian Bắt Đầu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời Gian Kết Thúc
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chức năng
              </th>
            </tr>
          </thead>

          {/* Nội dung Bảng */}
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {booking.bookerFullname || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {booking.bookerEmail} / {booking.bookerPhone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDateTime(booking.startTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDateTime(booking.endTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800" // pending
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <Link
                    href={`/admin/dashboard/bookings/${booking.id}`}
                    className="text-blue-600 hover:text-blue-900 font-semibold"
                  >
                    Chỉnh sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hiển thị lỗi hủy nếu có (Ví dụ) */}
      {bookings.length > 0 && (
        <div className="mt-6 text-sm text-gray-600">
          <p>
            Lưu ý: Cột Lý do Hủy không được hiển thị trong bảng để giữ cho bảng
            gọn gàng. Dữ liệu:{" "}
            {bookings.filter((b) => b.cancellationReason).length} bản ghi có lý
            do hủy.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingTable;

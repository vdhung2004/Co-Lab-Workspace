'use client'; 

import React, { useState, useEffect } from 'react';
import { Booking } from '@/lib/types/booking'; // Sử dụng type đã đề xuất
import dayjs, { Dayjs } from 'dayjs';

// Định nghĩa các trạng thái hợp lệ (Nếu chưa có trong type file)
type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
import { StatusDropdown } from '@/components/admin/bookings/components/statusDropdown';

// Giả sử chúng ta đang tìm chi tiết booking có ID là '1'
const BOOKING_ID = '1'; 
const API_URL = `http://localhost:8000/api/booking/${BOOKING_ID}`; 


const BookingEditableForm = () => {
  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<Partial<Booking>>({}); 
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: Booking = await response.json();
        setBookingData(result);
        // Sao chép dữ liệu API vào state formData để có thể chỉnh sửa
        setFormData(result); 
      } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetail();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value === '' ? null : value
    }));
  };

  const handleStatusChange = (newStatus: BookingStatus) => {
        setFormData(prev => ({
            ...prev,
            status: newStatus,
            // Xóa lý do hủy nếu trạng thái được chuyển sang không phải là 'cancelled'
            cancellationReason: newStatus !== 'cancelled' ? null : prev.cancellationReason,
        }));
    };
  
  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!bookingData) return;
      
      setIsSaving(true);
      setSaveMessage(null);
      
      

  if (loading) return <div className="text-center p-8">Đang tải chi tiết đặt chỗ...</div>;
  if (error) return <div className="text-center text-red-500 p-8">Lỗi tải dữ liệu: {error}</div>;
  if (!bookingData) return <div className="text-center p-8">Không tìm thấy chi tiết đặt chỗ.</div>;

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Chỉnh Sửa Đặt Chỗ #{bookingData.id}</h1>
      
      <form onSubmit={handleSave} className="bg-white p-8 rounded-lg shadow-xl">
        
        {/* Trường Booker Fullname */}
        <div className="mb-4">
          <label htmlFor="bookerFullname" className="block text-sm font-medium text-gray-700">Tên Người Đặt</label>
          <input
            type="text"
            id="bookerFullname"
            name="bookerFullname"
            value={formData.bookerFullname || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Trường Booker Email */}
        <div className="mb-4">
          <label htmlFor="bookerEmail" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="bookerEmail"
            name="bookerEmail"
            value={formData.bookerEmail || ''}
            onChange={handleInputChange}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Trường Booker Phone */}
        <div className="mb-4">
          <label htmlFor="bookerPhone" className="block text-sm font-medium text-gray-700">Số Điện Thoại</label>
          <input
            type="tel"
            id="bookerPhone"
            name="bookerPhone"
            value={formData.bookerPhone || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Thời gian Bắt đầu & Kết thúc (Chỉ hiển thị, vẫn dùng disabled) */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><label className="block text-sm font-medium text-gray-700">Thời Gian Bắt Đầu</label><input type="text" value={dayjs(bookingData.startTime).format('HH:mm, DD/MM/YYYY')} disabled className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 p-2 text-gray-900 cursor-not-allowed" /></div>
          <div><label className="block text-sm font-medium text-gray-700">Thời Gian Kết Thúc</label><input type="text" value={dayjs(bookingData.endTime).format('HH:mm, DD/MM/YYYY')} disabled className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 p-2 text-gray-900 cursor-not-allowed" /></div>
        </div>

        {/* Trường Trạng Thái (Chỉ hiển thị, nên dùng Dropdown riêng như trước) */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Cập Nhật Trạng Thái Đặt Chỗ</label>
          <StatusDropdown
            currentStatus={formData.status as BookingStatus}
            onStatusChange={handleStatusChange}
            disabled={isSaving}
          />
        </div>
        
        {/* Nút Lưu và Thông báo */}
        <div className="mt-6 flex justify-end items-center">
            {saveMessage && (
                <p className={`text-sm mr-4 ${saveMessage.startsWith('Lỗi') ? 'text-red-500' : 'text-green-500'}`}>
                    {saveMessage}
                </p>
            )}
            <button
                type="submit"
                disabled={isSaving}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
            >
                {isSaving ? 'Đang Lưu...' : 'Lưu Thay Đổi'}
            </button>
        </div>

        {/* Thông tin metadata */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
            <p>Mã Người Dùng (userId): {bookingData.userId || 'N/A'}</p>
            <p>Tạo lúc (createdAt): {bookingData.createdAt}</p>
        </div>

      </form>
    </div>
  );
  }}

export default BookingEditableForm;
import { BookingStatus } from '@/lib/types/booking';
export interface StatusDropdownProps {
  currentStatus: BookingStatus;
  onStatusChange: (newStatus: BookingStatus) => void;
  disabled?: boolean;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ 
  currentStatus, 
  onStatusChange,
  disabled = false 
}) => {
    //  Định nghĩa hàm xử lý thay đổi
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Ép kiểu giá trị sang BookingStatus và gọi hàm callback
    onStatusChange(event.target.value as BookingStatus);
  };
  return (
    <div className="relative">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={disabled}
        className={`
          appearance-none block w-full py-2 px-3 pr-8 rounded-md text-sm shadow-sm 
          border border-gray-300 bg-white text-gray-900 
          focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500
          ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
        `}
      >
        <option value="pending">PENDING (Đang chờ)</option>
        <option value="confirmed">CONFIRMED (Đã xác nhận)</option>
        <option value="completed">COMPLETED (Đã hoàn thành)</option>
        <option value="cancelled">CANCELLED (Hủy)</option>

      </select>
    </div>
  );
};
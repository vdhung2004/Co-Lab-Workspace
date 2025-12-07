'use client';
import React, { useState } from 'react';

// ------------------ TYPES ------------------
type Role = 'admin' | 'customer';
type Status = 'active' | 'locked';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole: Role;
  initialStatus: Status;
  onSave: (role: Role, status: Status) => void; 
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  initialRole,
  initialStatus,
  onSave,
}) => {

  const [role, setRole] = useState<Role>(initialRole);
  const [status, setStatus] = useState<Status>(initialStatus);

  if (!isOpen) return null;

  // Toggle giữa 'active' <-> 'locked'
  const toggleStatus = () => {
    setStatus((prev) => (prev === 'active' ? 'locked' : 'active'));
  };

  const handleSave = () => {
    onSave(role, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">

      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-300 scale-100">
        
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-900">Chỉnh Sửa Vai Trò & Trạng Thái</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          
          {/* ROLE */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Vai Trò (Role)
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          {/* STATUS (ACTIVE / LOCKED) */}
          <div className="flex items-center justify-between">
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Trạng Thái ({status === 'active' ? 'Active' : 'Locked'})
            </label>

            <button
              id="status"
              type="button"
              onClick={toggleStatus}
              className={`${
                status === 'active' ? 'bg-blue-600' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
              role="switch"
              aria-checked={status === 'active'}
            >
              <span
                aria-hidden="true"
                className={`${
                  status === 'active' ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              >
                {/* Text inside knob */}
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-500">
                  {status === 'active' ? 'A' : 'L'}
                </span>
              </span>
            </button>
          </div>

        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Lưu Thay Đổi
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserEditModal;

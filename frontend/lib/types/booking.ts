export interface Booking {
  id: string;
  userId: string | null;
  bookerEmail: string | null;
  bookerPhone: string | null;
  bookerFullname: string | null;
  startTime: string;
  endTime: string;
  status: "confirmed" | "completed" | "cancelled" | "pending"; // Hoặc các trạng thái khác
  cancellationReason: string | null;
  createdAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
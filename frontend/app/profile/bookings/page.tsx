import BookingList from "../components/booking-list";
import { ProfileSidebar } from "../components/profile-sidebar";

export default function BookingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lịch sử đặt chỗ</h1>
      <BookingList />
    </div>
  );
}

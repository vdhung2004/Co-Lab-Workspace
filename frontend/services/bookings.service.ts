type getBookingsByUserAPIResponse = {
  success: boolean;
  bookings?: any[];
  message?: string;
};

export async function getBookingsByUserAPI(): Promise<getBookingsByUserAPIResponse> {
  try {
    const res = await fetch(`http://localhost:5000/api/booking/user`, {
      method: "GET",
      credentials: "include",
    });
    console.log("Bookings data:", res);
    if (res.ok) {
      const data: getBookingsByUserAPIResponse = await res.json();
      console.log("Bookings data:", data);
      return {
        success: true,

        bookings: data.bookings,
      };
    } else {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.message || "Lấy lịch sử đặt chỗ thất bại",
      };
    }
  } catch (error) {
    console.error("Failed to fetch bookings by user:", error);
    throw error;
  }
}

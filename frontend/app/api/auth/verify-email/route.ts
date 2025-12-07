import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch("http://localhost:5000/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Lỗi khi gọi API xác minh email:", error);
    return NextResponse.json(
      { message: "Lỗi khi gọi API xác minh email" },
      { status: 500 }
    );
  }
}

import { RegisterFormType } from "@/components/auth/register-form";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const body: RegisterFormType = await req.json();
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Lỗi khi gọi API đăng ký:", error);
    return NextResponse.json(
      { message: "Lỗi khi gọi API đăng ký" },
      { status: 500 }
    );
  }
}

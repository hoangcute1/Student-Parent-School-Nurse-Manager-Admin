import { NextRequest, NextResponse } from "next/server";
import { getUserInfoFromToken } from "@/lib/utils/jwt";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    // Lấy token từ cookie tên 'authToken' hoặc header
    const token =
      request.cookies.get("authToken")?.value ||
      request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }
    const { userId, role } = getUserInfoFromToken(token);
    if (!userId || role !== "parent") {
      return NextResponse.json(
        { error: "Không tìm thấy thông tin phụ huynh." },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/simple-notifications/parent/${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      return NextResponse.json([], { status: 200 });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch parent notifications" },
      { status: 500 }
    );
  }
}

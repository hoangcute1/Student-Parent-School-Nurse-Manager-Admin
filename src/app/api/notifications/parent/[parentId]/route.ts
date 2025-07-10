import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ parentId: string }> }
) {
  try {
    const { parentId } = await params;

    console.log("Fetching notifications for parent:", parentId);

    // Gọi API backend thực
    const response = await fetch(
      `${BACKEND_URL}/notifications/parent/${parentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Backend error:", response.status, response.statusText);
      // Nếu backend lỗi, trả về mảng rỗng thay vì throw error
      return NextResponse.json([]);
    }

    const data = await response.json();
    console.log("Backend returned notifications:", data);
    return NextResponse.json(data);

    // TODO: Thay thế bằng API call thực tế khi backend sẵn sàng
    /*
    const response = await fetch(
      `${BACKEND_URL}/notifications/parent/${parentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch parent notifications");
    }

    const data = await response.json();
    return NextResponse.json(data);
    */
  } catch (error) {
    console.error("Error fetching parent notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch parent notifications" },
      { status: 500 }
    );
  }
}

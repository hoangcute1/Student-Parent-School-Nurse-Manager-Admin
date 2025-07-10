import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: { parentId: string } }
) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/notifications/parent/${params.parentId}`,
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
      throw new Error("Failed to fetch parent notifications");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching parent notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch parent notifications" },
      { status: 500 }
    );
  }
}

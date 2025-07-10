import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${BACKEND_URL}/notifications/${params.id}/respond`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to respond to notification");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error responding to notification:", error);
    return NextResponse.json(
      { error: "Failed to respond to notification" },
      { status: 500 }
    );
  }
}

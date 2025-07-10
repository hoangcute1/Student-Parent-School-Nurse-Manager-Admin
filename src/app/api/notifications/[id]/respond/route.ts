import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log("Responding to notification:", id, "with:", body);

    // Gọi API backend thực
    const response = await fetch(`${BACKEND_URL}/notifications/${id}/respond`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", response.status, errorText);
      throw new Error("Failed to respond to notification");
    }

    const data = await response.json();
    console.log("Backend response:", data);
    return NextResponse.json(data);

    // TODO: Thay thế bằng API call thực tế khi backend sẵn sàng
    /*
    const response = await fetch(
      `${BACKEND_URL}/notifications/${id}/respond`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to respond to notification");
    }

    const data = await response.json();
    return NextResponse.json(data);
    */
  } catch (error) {
    console.error("Error responding to notification:", error);
    return NextResponse.json(
      { error: "Failed to respond to notification" },
      { status: 500 }
    );
  }
}

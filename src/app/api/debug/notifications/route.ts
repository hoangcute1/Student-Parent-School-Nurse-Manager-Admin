import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    console.log("Debug: Fetching all notifications from backend...");

    // Gọi API backend để lấy tất cả notifications
    const response = await fetch(`${BACKEND_URL}/simple-notifications`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Backend error:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Backend error", status: response.status },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("Debug: All notifications from backend:", data);

    // Lọc ra các notification có type CONSULTATION_APPOINTMENT
    const consultationNotifications = data.filter(
      (notification: any) => notification.type === "CONSULTATION_APPOINTMENT"
    );

    console.log(
      "Debug: Consultation notifications:",
      consultationNotifications
    );

    return NextResponse.json({
      allNotifications: data,
      consultationNotifications: consultationNotifications,
      totalCount: data.length,
      consultationCount: consultationNotifications.length,
    });
  } catch (error) {
    console.error("Debug: Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications", details: error },
      { status: 500 }
    );
  }
}

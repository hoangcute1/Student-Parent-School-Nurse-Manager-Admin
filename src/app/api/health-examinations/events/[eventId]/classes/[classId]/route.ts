import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; classId: string }> }
) {
  try {
    const { eventId, classId } = await params;
    const url = new URL(request.url);
    const staffId = url.searchParams.get("staffId");

    const queryParams = new URLSearchParams();
    if (staffId) {
      queryParams.append("staffId", staffId);
    }

    const response = await fetch(
      `${BACKEND_URL}/health-examinations/events/${eventId}/classes/${classId}?${queryParams}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching health examination class detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch health examination class detail" },
      { status: 500 }
    );
  }
}

import { fetchData } from "@/lib/api/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get("staffId");

    const queryParams = new URLSearchParams();
    if (staffId) {
      queryParams.append("staffId", staffId);
    }

    const response = await fetchData<any>(
      `/health-examinations/events/${eventId}?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response from backend:", response);
    if (!response) {
      throw new Error("Failed to fetch health examination event detail");
    }

    const data = response;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching health examination event detail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;

    // Xóa tất cả lịch khám thuộc sự kiện này
    const response = await fetchData<any>(
      `/health-examinations/events/${eventId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response) {
      const errorData = response;
      console.error("Backend error response:", {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
      });
      return NextResponse.json(
        {
          error: "Failed to delete health examination event",
          details: errorData,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = response;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting health examination event:", error);
    return NextResponse.json(
      { error: "Failed to delete health examination event" },
      { status: 500 }
    );
  }
}

import { fetchData } from "@/lib/api/api";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetchData<any>(
      `${BACKEND_URL}/health-examinations/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response) {
      throw new Error("Failed to delete health examination");
    }
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting health examination:", error);
    return NextResponse.json(
      { error: "Failed to delete health examination" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(`${BACKEND_URL}/health-examinations/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch health examination");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching health examination:", error);
    return NextResponse.json(
      { error: "Failed to fetch health examination" },
      { status: 500 }
    );
  }
}

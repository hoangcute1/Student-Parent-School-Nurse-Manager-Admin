import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();

    const response = await fetch(
      `${BACKEND_URL}/health-examinations?${query}`,
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
      throw new Error("Failed to fetch health examinations");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching health examinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch health examinations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Frontend API received body:", body);

    // For demo purposes, use a test staff ID
    const staffId = "66d9e9a4f8b123456789abcd"; // Replace with actual staff ID from auth

    console.log("Sending to backend:", {
      url: `${BACKEND_URL}/health-examinations?staffId=${staffId}`,
      body: body,
    });

    const response = await fetch(
      `${BACKEND_URL}/health-examinations?staffId=${staffId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Backend error response:", {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
      });
      return NextResponse.json(
        {
          error: "Failed to create health examination",
          details: errorData,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating health examination:", error);
    return NextResponse.json(
      { error: "Failed to create health examination" },
      { status: 500 }
    );
  }
}

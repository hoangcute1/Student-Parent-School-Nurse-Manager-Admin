import { NextResponse } from "next/server";

// This is a placeholder for the actual backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/export-history`, {
      cache: "no-store", // Ensure fresh data is fetched every time
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          message: `Error fetching export history: ${
            errorData.message || response.statusText
          }`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: `Internal Server Error: ${message}` },
      { status: 500 }
    );
  }
}

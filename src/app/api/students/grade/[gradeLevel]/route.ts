import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gradeLevel: string }> }
) {
  try {
    const { gradeLevel } = await params;
    const response = await fetch(
      `${BACKEND_URL}/students/grade/${gradeLevel}`,
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
      throw new Error("Failed to fetch students by grade level");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching students by grade level:", error);
    return NextResponse.json(
      { error: "Failed to fetch students by grade level" },
      { status: 500 }
    );
  }
}

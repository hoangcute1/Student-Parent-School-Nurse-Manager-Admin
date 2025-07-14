import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "@/lib/api/notification";
import { cookies } from "next/headers";

// Sửa lại cổng backend về 3001 (NestJS mặc định)
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received body:", body);

    // Lấy token từ cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      console.error("No auth token found in cookies");
      return NextResponse.json(
        { error: "No auth token found" },
        { status: 401 }
      );
    }

    console.log("Token found:", token.substring(0, 20) + "...");

    const studentResponse = await fetch(
      `${BACKEND_URL}/students/${body.student_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Student response status:", studentResponse.status);
    if (!studentResponse.ok) {
      const errText = await studentResponse.text();
      console.error("Student fetch error:", errText);
      throw new Error("Failed to fetch student information");
    }
    const studentData = await studentResponse.json();
    console.log("Student data:", studentData);

    const parentId = studentData.parent?._id || studentData.parent;
    console.log("ParentId:", parentId);
    if (!parentId) {
      console.error("Parent not found for student:", studentData);
      throw new Error("Parent not found for student");
    }

    // Tạo notification cho phụ huynh
    await createNotification({
      parent: parentId,
      student: body.student_id,
      content: `Lịch hẹn tư vấn: ${body.title}`,
      notes: `Bác sĩ: ${body.doctor}\nNgày hẹn: ${new Date(
        body.consultation_date
      ).toLocaleDateString("vi-VN")}\nGiờ hẹn: ${
        body.consultation_time
      }\nGhi chú: ${body.notes || "Không có"}`,
      type: "CONSULTATION_APPOINTMENT",
      relatedId: `consultation-${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      message: "Lập lịch hẹn tư vấn thành công",
    });
  } catch (error) {
    console.error("Error in schedule-consultation API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

"use client";

import { useEffect, useState } from "react";
import { getStudents, createStudent } from "@/lib/api/students";
import type { Student as ApiStudent } from "@/lib/type/students";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { StudentTable } from "./_components/student-table";
import { StatsCards } from "./_components/stats-cards";
import { FilterBar } from "./_components/filter-bar";
import type { StudentFormValues } from "./_components/add-student-dialog";

// Local interface for UI display
interface DisplayStudent {
  name: string;
  studentId: string;
  class: string;
  birthDate: string;
  parent: string;
  healthStatus: string;
  lastUpdate: string;
}

interface StatsData {
  total: number;
  healthy: number;
  monitoring: number;
  urgent: number;
}
const mapToDisplayStudent = (apiStudent: ApiStudent): DisplayStudent => ({
  name: apiStudent.name,
  studentId: apiStudent.studentId,
  class: apiStudent.class || "N/A",
  birthDate: apiStudent.birth || "N/A",
  parent: "Parent Information",
  healthStatus: "Sức khỏe tốt", // Default value
  lastUpdate: new Date(apiStudent.updatedAt).toLocaleDateString("vi-VN"),
});

export default function StudentsPage() {
  const [studentData, setStudentData] = useState<DisplayStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    healthy: 0,
    monitoring: 0,
    urgent: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);

        const response = await getStudents();
        console.log("API response:", response);

        // Map API response to the local display format
        const students = response.data.map(mapToDisplayStudent);

        console.log("Transformed student data:", students);
        setStudentData(students);

        // Calculate statistics
        const total = students.length;
        const healthy = students.filter(
          (student) => student.healthStatus === "Sức khỏe tốt"
        ).length;
        const monitoring = students.filter(
          (student) => student.healthStatus === "Cần theo dõi"
        ).length;
        const urgent = students.filter(
          (student) => student.healthStatus === "Khẩn cấp"
        ).length;

        setStats({ total, healthy, monitoring, urgent });
      } catch (err: any) {
        console.error("Failed to fetch students:", err);
        setError(err.message);

        // Handle authentication errors specifically
        if (
          err.message.includes("401") ||
          err.message.toLowerCase().includes("unauthorized")
        ) {
          console.log("Authentication error detected, redirecting to login...");
          // Optional: Redirect to login page
          // window.location.href = "/login";
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const onSubmit = async (data: StudentFormValues) => {
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      // Create new student with the exact props required by API
      const newStudent = await createStudent({
        name: data.name,
        studentId: data.studentId,
        birth: data.birth,
        gender: data.gender,
        grade: data.grade,
        class: data.class,
        parentId: data.parentId || undefined,
      });

      // Add the new student to the list without needing a full refresh
      const newDisplayStudent = mapToDisplayStudent(newStudent);
      setStudentData((prev) => [...prev, newDisplayStudent]);

      // Update stats
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        healthy: prev.healthy + 1, // Assuming new students start as healthy
      }));
    } catch (err: any) {
      console.error("Failed to create student:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create student";
      setError(errorMessage);
      throw new Error(errorMessage); // Re-throw to be caught by the form
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Quản lý học sinh
        </h1>
        <p className="text-blue-600">
          Danh sách tất cả học sinh và thông tin sức khỏe của các em
        </p>
      </div>

      <StatsCards stats={stats} />

      {/* Bộ lọc và tìm kiếm */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-800">Danh sách học sinh</CardTitle>
          <CardDescription className="text-blue-600">
            Quản lý thông tin và sức khỏe của tất cả học sinh trong trường
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FilterBar
            onSearchChange={setSearchQuery}
            onClassFilterChange={setClassFilter}
            onHealthStatusChange={setHealthFilter}
            onAddStudent={onSubmit}
          />
          <StudentTable
            students={studentData}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
}

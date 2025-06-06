"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Download, Users, AlertTriangle } from "lucide-react";
import { getStudents } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { StudentTable } from "./_components/student-table";
import { AddStudentDialog } from "./_components/add-student-dialog";
import type { StudentFormValues } from "./_components/add-student-dialog";

interface Student {
  name: string;
  studentId: string;
  class: string;
  birthDate: string;
  parent: string;
  healthStatus: string;
  allergies: string | null;
  lastUpdate: string;
}

interface StatsData {
  total: number;
  healthy: number;
  monitoring: number;
  urgent: number;
}

export default function StudentsPage() {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    healthy: 0,
    monitoring: 0,
    urgent: 0,
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);

        const response = await getStudents();
        console.log("API response:", response);

        // Map API response to the local Student interface format
        const students = response.data.map((student: any) => ({
          name: student.name,
          studentId: student.studentId,
          class: student.class || "N/A",
          birthDate: student.birth || "N/A",
          parent: "Parent Information", // Add default or get from API if available
          healthStatus: student.healthStatus || "Sức khỏe tốt", // Default value
          allergies: student.allergies,
          lastUpdate: new Date(student.updatedAt).toLocaleDateString("vi-VN"),
        }));

        console.log("Transformed student data:", students);
        setStudentData(students);

        // Calculate statistics
        const total = students.length;
        const healthy = students.filter(
          (student: Student) => student.healthStatus === "Sức khỏe tốt"
        ).length;
        const monitoring = students.filter(
          (student: Student) => student.healthStatus === "Cần theo dõi"
        ).length;
        const urgent = students.filter(
          (student: Student) => student.healthStatus === "Khẩn cấp"
        ).length;

        setStats({
          total,
          healthy,
          monitoring,
          urgent,
        });
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
      // TODO: Implement API call to create student
      console.log("Form submitted:", data);
      // After successful submission, refresh student list
      // await fetchStudents();
    } catch (err) {
      console.error("Failed to create student:", err);
      // Show error to user
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

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-800">
                  {stats.total}
                </div>
                <div className="text-sm text-blue-600">Tổng học sinh</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-800">
                  {stats.healthy}
                </div>
                <div className="text-sm text-green-600">Sức khỏe tốt</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-800">
                  {stats.monitoring}
                </div>
                <div className="text-sm text-yellow-600">Cần theo dõi</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-800">
                  {stats.urgent}
                </div>
                <div className="text-sm text-red-600">Khẩn cấp</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-800">Danh sách học sinh</CardTitle>
          <CardDescription className="text-blue-600">
            Quản lý thông tin và sức khỏe của tất cả học sinh trong trường
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
              <Input
                type="search"
                placeholder="Tìm kiếm theo tên, mã học sinh..."
                className="pl-8 border-blue-200 focus:border-blue-500"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px] border-blue-200">
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                <SelectItem value="1A">Lớp 1A</SelectItem>
                <SelectItem value="1B">Lớp 1B</SelectItem>
                <SelectItem value="2A">Lớp 2A</SelectItem>
                <SelectItem value="2B">Lớp 2B</SelectItem>
                <SelectItem value="3A">Lớp 3A</SelectItem>
                <SelectItem value="3B">Lớp 3B</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] border-blue-200">
                <SelectValue placeholder="Tình trạng sức khỏe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="good">Sức khỏe tốt</SelectItem>
                <SelectItem value="monitor">Cần theo dõi</SelectItem>
                <SelectItem value="urgent">Khẩn cấp</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4" />
            </Button>
            <AddStudentDialog onSubmit={onSubmit} />
          </div>
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

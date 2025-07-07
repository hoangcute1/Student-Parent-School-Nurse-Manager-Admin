"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StudentTable } from "./_components/student-table";
import { FilterBar } from "./_components/filter-bar";
import { useStudentStore } from "@/stores/student-store";
import { useClassStore } from "@/stores/class-store";
import { useAuthStore } from "@/stores/auth-store";
import type { AddStudentFormValues } from "./_components/add-student-dialog";
import type { UpdateStudentFormValues } from "./_components/update-student-dialog";
import { Student, ViewStudent } from "@/lib/type/students";
import { AddStudentDialog } from "./_components/add-student-dialog";
import { UpdateStudentDialog } from "./_components/update-student-dialog";

const mapStudentForDisplay = (students: Student): Student => {
  return {
    ...students,
  };
};

export default function StudentsPage() {
  const {
    students,
    isLoading,
    error,
    fetchStudents,
    fetchStudentById,
    deleteStudent,
    updateStudent,
    createStudent,
    selectedStudent,
    selectedStudentId,
  } = useStudentStore();
  const { classes, fetchClasses } = useClassStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);

  // Transform student data for display
  const displayStudents = students
    .map(mapStudentForDisplay)
    .filter((studentData) => {
      // Apply search filter if exists
      if (searchQuery && searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          studentData.student.name.toLowerCase().includes(query) ||
          studentData.student.studentId.toLowerCase().includes(query) ||
          (studentData.class?.name &&
            studentData.class.name.toLowerCase().includes(query))
        );
      }

      // Apply class filter if not "all"
      if (classFilter !== "all") {
        return studentData.class?.name === classFilter;
      }

      return true;
    });

  const handleExportToExcel = () => {
    try {
      // Chuẩn bị dữ liệu để xuất
      const exportData = displayStudents.map(
        (studentData: any, index: number) => ({
          STT: index + 1,
          "Mã học sinh": studentData.student?.studentId || "",
          "Họ và tên": studentData.student?.name || "",
          "Giới tính":
            studentData.student?.gender === "male"
              ? "Nam"
              : studentData.student?.gender === "female"
              ? "Nữ"
              : "",
          "Ngày sinh": studentData.student?.birth
            ? new Date(studentData.student.birth).toLocaleDateString("vi-VN")
            : "",
          Lớp: studentData.class?.name || "",
          "Trạng thái sức khỏe": studentData.student?.healthStatus || "",
          "Tình trạng dị ứng":
            studentData.student?.allergies?.join(", ") || "Không có",
          "Ghi chú": studentData.student?.notes || "",
          "Ngày tạo": studentData.student?.created_at
            ? new Date(studentData.student.created_at).toLocaleDateString(
                "vi-VN"
              )
            : "",
        })
      );

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Thiết lập độ rộng cột
      const colWidths = [
        { wch: 5 }, // STT
        { wch: 15 }, // Mã học sinh
        { wch: 25 }, // Họ và tên
        { wch: 10 }, // Giới tính
        { wch: 12 }, // Ngày sinh
        { wch: 10 }, // Lớp
        { wch: 20 }, // Trạng thái sức khỏe
        { wch: 30 }, // Tình trạng dị ứng
        { wch: 30 }, // Ghi chú
        { wch: 12 }, // Ngày tạo
      ];
      ws["!cols"] = colWidths;

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách học sinh");

      // Xuất file với tên có ngày tháng
      const fileName = `Danh_sach_hoc_sinh_${new Date()
        .toLocaleDateString("vi-VN")
        .replace(/\//g, "_")}.xlsx`;
      XLSX.writeFile(wb, fileName);

      // Hiển thị thông báo thành công (có thể thêm toast notification)
      alert("Xuất báo cáo Excel thành công!");
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error);
      alert("Có lỗi xảy ra khi xuất báo cáo!");
    }
  };

  useEffect(() => {
    // Fetch students and classes if not already loaded
    if (students.length === 0) {
      fetchStudents();
    }

    if (classes.length === 0) {
      fetchClasses();
    }
  }, [fetchStudents, fetchClasses, students.length, classes.length]);

  const handleAddStudent = async (data: AddStudentFormValues) => {
    // if (!user || user.role !== "admin") {
    //   alert("Bạn không có quyền thêm học sinh");
    //   return;
    // }
    try {
      // Validate classId exists in classes
      // const selectedClass = classes.find((cls) => cls._id === data.class);
      // if (!selectedClass) {
      //   alert("Lớp không tồn tại");
      //   return;
      // }

      await createStudent({
        name: data.name,
        studentId: data.studentId,
        birth: data.birth,
        gender: data.gender,
        class: data.class,
        parentEmail: data.parentEmail || undefined,
      });
      setIsAddDialogOpen(false);
      alert("Thêm học sinh thành công");
    } catch (error: any) {
      console.error("Error adding student:", error.message, error);
      alert(
        `Không thể thêm học sinh: ${error.message || "Lỗi không xác định"}`
      );
    }
  };

  const handleViewStudent = async (studentData: Student) => {
    await fetchStudentById(studentData.student._id);
    setIsViewDialogOpen(true);
  };

  const handleEditStudent = async (studentData: Student) => {
    await fetchStudentById(studentData.student._id);
    setIsEditDialogOpen(true);
  };

  const handleDeleteStudent = async (studentData: Student) => {
    if (
      window.confirm(
        `Bạn có chắc muốn xoá học sinh ${studentData.student.name}?`
      )
    ) {
      try {
        await deleteStudent(studentData.student._id);
        alert(`Đã xoá học sinh ${studentData.student.name}`);
      } catch (error: any) {
        console.error("Error deleting student:", error.message, error);
        alert(
          `Không thể xoá học sinh: ${error.message || "Lỗi không xác định"}`
        );
      }
      setDeleteStudentId(null);
    }
  };

  const handleUpdateStudent = async (data: UpdateStudentFormValues) => {
    if (!user || user.role !== "admin") {
      alert("Bạn không có quyền chỉnh sửa học sinh");
      return;
    }
    if (selectedStudent) {
      try {
        await updateStudent(selectedStudent.student._id, {
          name: data.name,
          studentId: data.studentId,
          birth: data.birth,
          gender: data.gender,
          classId: data.classId,
          parentId: data.parentId || undefined,
        });
        setIsEditDialogOpen(false);
        alert("Cập nhật học sinh thành công");
      } catch (error: any) {
        console.error("Error updating student:", error.message, error);
        alert(
          `Không thể cập nhật học sinh: ${
            error.message || "Lỗi không xác định"
          }`
        );
      }
    }
  };

  // Calculate stats
  const totalStudents = displayStudents.length;
  const maleStudents = displayStudents.filter(
    (student) => student.student.gender === "male"
  ).length;
  const femaleStudents = displayStudents.filter(
    (student) => student.student.gender === "female"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl shadow-lg mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-sky-800 bg-clip-text text-transparent">
            Dashboard - Quản lý học sinh
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Theo dõi thông tin học sinh, thống kê sức khỏe và quản lý hồ sơ
          </p>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng học sinh
                  </p>
                  <p className="text-3xl font-bold text-sky-700">
                    {totalStudents}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    ↗ +12% từ tháng trước
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-sky-100 to-sky-200 rounded-xl">
                  <svg
                    className="w-6 h-6 text-sky-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Học sinh nam
                  </p>
                  <p className="text-3xl font-bold text-blue-700">
                    {maleStudents}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {totalStudents > 0
                      ? Math.round((maleStudents / totalStudents) * 100)
                      : 0}
                    % tổng số
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Học sinh nữ
                  </p>
                  <p className="text-3xl font-bold text-pink-700">
                    {femaleStudents}
                  </p>
                  <p className="text-xs text-pink-600 mt-1">
                    {totalStudents > 0
                      ? Math.round((femaleStudents / totalStudents) * 100)
                      : 0}
                    % tổng số
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl">
                  <svg
                    className="w-6 h-6 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">
                  Thao tác nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white py-3 px-4 rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Thêm học sinh mới</span>
                </button>
                <button
                  onClick={handleExportToExcel}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Xuất báo cáo Excel</span>
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Main Data Table */}
          <div className="lg:col-span-3">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      Danh sách học sinh
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Quản lý thông tin và hồ sơ học sinh trong trường
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <FilterBar
                  onSearchChange={setSearchQuery}
                  onClassFilterChange={setClassFilter}
                  onHealthStatusChange={setHealthFilter}
                />
                <div className="mt-6">
                  <StudentTable
                    students={displayStudents}
                    isLoading={isLoading}
                    error={error}
                    onView={handleViewStudent}
                    onEdit={handleEditStudent}
                    onDelete={handleDeleteStudent}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dialog for viewing student details */}
            {selectedStudentId && (
              <Dialog
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
              >
                <DialogContent className="max-w-lg p-6 rounded-xl shadow-2xl border border-sky-200 bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-sky-700 mb-2">
                      Thông tin học sinh: {selectedStudentId.student.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex gap-2">
                      <span className="font-semibold text-sky-600 min-w-[120px]">
                        Mã học sinh:
                      </span>
                      <span className="text-sky-900">
                        {selectedStudentId.student.studentId}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-sky-600 min-w-[120px]">
                        Lớp:
                      </span>
                      <span className="text-sky-900">
                        {selectedStudentId.class?.name || "Chưa phân lớp"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-sky-600 min-w-[120px]">
                        Khối:
                      </span>
                      <span className="text-sky-900">
                        {selectedStudentId.class?.grade || "N/A"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-sky-600 min-w-[120px]">
                        Ngày sinh:
                      </span>
                      <span className="text-sky-900">
                        {selectedStudentId.student.birth
                          ? new Date(selectedStudentId.student.birth)
                              .toISOString()
                              .split("T")[0]
                          : ""}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-sky-600 min-w-[120px]">
                        Giới tính:
                      </span>
                      <span className="text-sky-900">
                        {selectedStudentId.student.gender === "male"
                          ? "Nam"
                          : selectedStudentId.student.gender === "female"
                          ? "Nữ"
                          : "Không rõ"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-sky-600 min-w-[120px]">
                        ID phụ huynh:
                      </span>
                      <span className="text-sky-900">
                        {selectedStudentId.parent?._id || "N/A"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-sky-600 min-w-[120px]">
                        Dị ứng:
                      </span>
                      <span className="text-sky-900">
                        {selectedStudentId.healthRecord.allergies || "N/A"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-sky-600 min-w-[120px]">
                        Bệnh mãn tính:
                      </span>
                      <span className="text-sky-900">
                        {selectedStudentId.healthRecord.chronic_conditions ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-sky-600 min-w-[120px]">
                        Lịch sử bệnh án:
                      </span>
                      <span className="text-sky-900">
                        {selectedStudentId.healthRecord.treatment_history ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Dialog for adding student */}
            <AddStudentDialog
              onSubmit={handleAddStudent}
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
            />

            {/* Dialog for editing student details */}
            {selectedStudent && (
              <UpdateStudentDialog
                onSubmit={handleUpdateStudent}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                defaultValues={{
                  name: selectedStudent.student.name,
                  studentId: selectedStudent.student.studentId,
                  birth: selectedStudent.student.birth
                    ? new Date(selectedStudent.student.birth)
                        .toISOString()
                        .split("T")[0]
                    : "",
                  gender:
                    selectedStudent.student.gender === "male" ||
                    selectedStudent.student.gender === "female"
                      ? selectedStudent.student.gender
                      : "male",
                  classId: selectedStudent.class?._id || "",
                  parentId: selectedStudent.parent?._id || "",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

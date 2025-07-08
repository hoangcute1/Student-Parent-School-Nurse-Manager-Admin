"use client";

import { useEffect, useState } from "react";
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
import { Student, ViewStudent } from "@/lib/type/students";
import { AddStudentDialog } from "./_components/add-student-dialog";
import { Users } from "lucide-react";

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

  // Calculate stats
  const totalStudents = displayStudents.length;
  const maleStudents = displayStudents.filter(
    (s) => s.student.gender === "male"
  ).length;
  const femaleStudents = displayStudents.filter(
    (s) => s.student.gender === "female"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl shadow-lg mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-sky-800 bg-clip-text text-transparent">
            Quản lý học sinh
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quản lý thông tin học sinh, theo dõi học tập và hỗ trợ phát triển
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                </div>
                <div className="p-3 bg-sky-100 rounded-xl">
                  <Users className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nam</p>
                  <p className="text-3xl font-bold text-sky-700">
                    {maleStudents}
                  </p>
                </div>
                <div className="p-3 bg-sky-100 rounded-xl">
                  <Users className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nữ</p>
                  <p className="text-3xl font-bold text-sky-700">
                    {femaleStudents}
                  </p>
                </div>
                <div className="p-3 bg-sky-100 rounded-xl">
                  <Users className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
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
            <StudentTable
              students={displayStudents}
              isLoading={isLoading}
              error={error}
              onView={handleViewStudent}
              onDelete={handleDeleteStudent}
              onAddStudent={() => setIsAddDialogOpen(true)}
            />
          </CardContent>
        </Card>

        {/* Dialog for viewing student details */}
        {selectedStudentId && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-4xl p-0 rounded-2xl shadow-2xl border-0 bg-white overflow-hidden">
              <DialogHeader className="p-6 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-blue-50">
                <DialogTitle className="text-2xl font-bold text-sky-800 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  Thông tin học sinh: {selectedStudentId.student.name}
                </DialogTitle>
              </DialogHeader>

              <div className="p-6 space-y-6">
                {/* Basic Information Section */}
                <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-200">
                  <h3 className="text-lg font-semibold text-sky-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                    Thông tin cơ bản
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-sky-100">
                      <span className="font-medium text-sky-700 min-w-[120px]">
                        Mã học sinh:
                      </span>
                      <span className="text-sky-900 font-medium">
                        {selectedStudentId.student.studentId}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-sky-100">
                      <span className="font-medium text-sky-700 min-w-[120px]">
                        Lớp:
                      </span>
                      <span className="text-sky-900 font-medium">
                        {selectedStudentId.class?.name || "Chưa phân lớp"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-sky-100">
                      <span className="font-medium text-sky-700 min-w-[120px]">
                        Khối:
                      </span>
                      <span className="text-sky-900 font-medium">
                        {selectedStudentId.class?.grade || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-sky-100">
                      <span className="font-medium text-sky-700 min-w-[120px]">
                        Ngày sinh:
                      </span>
                      <span className="text-sky-900 font-medium">
                        {selectedStudentId.student.birth
                          ? new Date(
                              selectedStudentId.student.birth
                            ).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-sky-100">
                      <span className="font-medium text-sky-700 min-w-[120px]">
                        Giới tính:
                      </span>
                      <span className="text-sky-900 font-medium">
                        {selectedStudentId.student.gender === "male"
                          ? "Nam"
                          : selectedStudentId.student.gender === "female"
                          ? "Nữ"
                          : "Không rõ"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-sky-100">
                      <span className="font-medium text-sky-700 min-w-[120px]">
                        ID phụ huynh:
                      </span>
                      <span className="text-sky-900 font-medium">
                        {selectedStudentId.parent?._id || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Health Information Section */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                  <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Thông tin sức khỏe
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Row 1 - Physical measurements */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="font-medium text-emerald-700 min-w-[120px]">
                        Chiều cao:
                      </span>
                      <span className="text-emerald-900 font-medium">
                        {selectedStudentId.healthRecord.height
                          ? `${selectedStudentId.healthRecord.height} cm`
                          : "Chưa cập nhật"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="font-medium text-emerald-700 min-w-[120px]">
                        Cân nặng:
                      </span>
                      <span className="text-emerald-900 font-medium">
                        {selectedStudentId.healthRecord.weight
                          ? `${selectedStudentId.healthRecord.weight} kg`
                          : "Chưa cập nhật"}
                      </span>
                    </div>

                    {/* Row 2 - Blood type and senses */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="font-medium text-emerald-700 min-w-[120px]">
                        Nhóm máu:
                      </span>
                      <span className="text-emerald-900 font-medium">
                        {selectedStudentId.healthRecord.blood_type ||
                          "Chưa xác định"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="font-medium text-emerald-700 min-w-[120px]">
                        Thị lực:
                      </span>
                      <span className="text-emerald-900 font-medium">
                        {selectedStudentId.healthRecord.vision ||
                          "Chưa kiểm tra"}
                      </span>
                    </div>

                    {/* Row 3 - Hearing and allergies */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="font-medium text-emerald-700 min-w-[120px]">
                        Thính lực:
                      </span>
                      <span className="text-emerald-900 font-medium">
                        {selectedStudentId.healthRecord.hearing ||
                          "Chưa kiểm tra"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="font-medium text-emerald-700 min-w-[120px]">
                        Dị ứng:
                      </span>
                      <span className="text-emerald-900 font-medium">
                        {selectedStudentId.healthRecord.allergies || "Không có"}
                      </span>
                    </div>

                    {/* Row 4 - Chronic conditions and notes */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="font-medium text-emerald-700 min-w-[120px]">
                        Bệnh mãn tính:
                      </span>
                      <span className="text-emerald-900 font-medium">
                        {selectedStudentId.healthRecord.chronic_conditions ||
                          "Không có"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="font-medium text-emerald-700 min-w-[120px]">
                        Ghi chú:
                      </span>
                      <span className="text-emerald-900 font-medium">
                        {selectedStudentId.healthRecord.notes || "Không có"}
                      </span>
                    </div>

                    {/* Treatment history spans full width */}
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-emerald-100 md:col-span-2">
                      <span className="font-medium text-emerald-700 min-w-[120px]">
                        Lịch sử bệnh án:
                      </span>
                      <span className="text-emerald-900 font-medium">
                        {selectedStudentId.healthRecord.treatment_history ||
                          "Không có"}
                      </span>
                    </div>
                  </div>
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
      </div>
    </div>
  );
}

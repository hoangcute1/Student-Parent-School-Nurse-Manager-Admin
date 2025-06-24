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
    fetchStudentsByClass,
    fetchStudentById,
    deleteStudent,
    updateStudent,
    createStudent,
    selectedStudent,
    setSelectedClassId,
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
    if (!user || user.role !== "admin") {
      alert("Bạn không có quyền thêm học sinh");
      return;
    }
    try {
      // Validate classId exists in classes
      // const selectedClass = classes.find((cls) => cls._id === data.classId);
      // if (!selectedClass) {
      //   alert("Lớp không tồn tại");
      //   return;
      // }

      await createStudent({
        name: data.name,
        studentId: data.studentId,
        birth: data.birth,
        gender: data.gender,
        classId: data.classId,
        parentId: data.parentId || undefined,
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Quản lý học sinh
        </h1>
        <p className="text-blue-600">Danh sách học sinh và thông tin cá nhân</p>
      </div>

      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-800">Danh sách học sinh</CardTitle>
          <CardDescription className="text-blue-600">
            Quản lý thông tin và hồ sơ học sinh trong trường
          </CardDescription>
        </CardHeader>
        <CardContent>
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
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            onAddStudent={() => setIsAddDialogOpen(true)}
          />
        </CardContent>
      </Card>

      {/* Dialog for viewing student details */}
      {selectedStudentId && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-lg p-6 rounded-xl shadow-2xl border border-blue-100 bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-blue-700 mb-2">
                Thông tin học sinh: {selectedStudentId.student.name}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 min-w-[120px]">
                  Mã học sinh:
                </span>
                <span className="text-gray-900">
                  {selectedStudentId.student.studentId}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 min-w-[120px]">
                  Lớp:
                </span>
                <span className="text-gray-900">
                  {selectedStudentId.class?.name || "Chưa phân lớp"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 min-w-[120px]">
                  Khối:
                </span>
                <span className="text-gray-900">
                  {selectedStudentId.class?.grade || "N/A"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 min-w-[120px]">
                  Ngày sinh:
                </span>
                <span className="text-gray-900">
                  {selectedStudentId.student.birth
                    ? new Date(selectedStudentId.student.birth)
                        .toISOString()
                        .split("T")[0]
                    : ""}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 min-w-[120px]">
                  Giới tính:
                </span>
                <span className="text-gray-900">
                  {selectedStudentId.student.gender === "male"
                    ? "Nam"
                    : selectedStudentId.student.gender === "female"
                    ? "Nữ"
                    : "Không rõ"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 min-w-[120px]">
                  ID phụ huynh:
                </span>
                <span className="text-gray-900">
                  {selectedStudentId.parent?._id || "N/A"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 min-w-[120px]">
                  Dị ứng:
                </span>
                <span className="text-gray-900">
                  {selectedStudentId.healthRecord.allergies || "N/A"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 min-w-[120px]">
                  Bệnh mãn tính:
                </span>
                <span className="text-gray-900">
                  {selectedStudentId.healthRecord.chronic_conditions || "N/A"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-600 min-w-[120px]">
                  Lịch sử bệnh án:
                </span>
                <span className="text-gray-900">
                  {selectedStudentId.healthRecord.treatment_history || "N/A"}
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
  );
}

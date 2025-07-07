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
import { Student } from "@/lib/type/students";
import { AddStudentDialog } from "./_components/add-student-dialog";
import { UpdateStudentDialog } from "./_components/update-student-dialog";

const mapStudentForDisplay = (student: Student): Student => {
  return {
    ...student,
    birth: student.birth
      ? new Date(student.birth).toLocaleDateString("vi-VN")
      : "Không rõ",
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
    .filter((student) => {
      // Apply search filter if exists
      if (searchQuery && searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          student.name.toLowerCase().includes(query) ||
          student.studentId.toLowerCase().includes(query) ||
          (student.class?.name &&
            student.class.name.toLowerCase().includes(query))
        );
      }

      // Apply class filter if not "all"
      if (classFilter !== "all") {
        return student.class?.name === classFilter;
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
  }, []); // Chỉ chạy một lần khi component mount

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
      alert(`Không thể thêm học sinh: ${error.message || "Lỗi không xác định"}`);
    }
  };

  const handleViewStudent = async (student: Student) => {
    await fetchStudentById(student._id);
    setIsViewDialogOpen(true);
  };

  const handleEditStudent = async (student: Student) => {
    await fetchStudentById(student._id);
    setIsEditDialogOpen(true);
  };

  const handleDeleteStudent = async (student: Student) => {
    if (window.confirm(`Bạn có chắc muốn xoá học sinh ${student.name}?`)) {
      try {
        await deleteStudent(student._id);
        alert(`Đã xoá học sinh ${student.name}`);
      } catch (error: any) {
        console.error("Error deleting student:", error.message, error);
        alert(`Không thể xoá học sinh: ${error.message || "Lỗi không xác định"}`);
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
        await updateStudent(selectedStudent._id, {
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
        alert(`Không thể cập nhật học sinh: ${error.message || "Lỗi không xác định"}`);
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
      {selectedStudent && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thông tin học sinh: {selectedStudent.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p><strong>Mã học sinh:</strong> {selectedStudent.studentId}</p>
              <p><strong>Lớp:</strong> {selectedStudent.class?.name || "Chưa phân lớp"}</p>
              <p><strong>Khối:</strong> {selectedStudent.class?.grade || "N/A"}</p>
              <p><strong>Ngày sinh:</strong> {selectedStudent.birth
                ? new Date(selectedStudent.birth).toISOString().split("T")[0]
                : ""}</p>
              <p><strong>Giới tính:</strong>
                {selectedStudent.gender === "male" ? "Nam" : selectedStudent.gender === "female" ? "Nữ" : "Không rõ"}
              </p>
              <p><strong>ID phụ huynh:</strong> {selectedStudent.parent?._id || "N/A"}</p>
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
            name: selectedStudent.name,
            studentId: selectedStudent.studentId,
            birth: selectedStudent.birth
              ? new Date(selectedStudent.birth).toISOString().split("T")[0]
              : "",
            gender: selectedStudent.gender === "male" || selectedStudent.gender === "female"
              ? selectedStudent.gender
              : "male",
            classId: selectedStudent.class?._id || "",
            parentId: selectedStudent.parent?._id || "",
          }}
        />
      )}
    </div>
  );
}
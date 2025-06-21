"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StudentTable } from "./_components/student-table";
import { FilterBar } from "./_components/filter-bar";
import { useStudentStore } from "@/stores/student-store";
import { useClassStore } from "@/stores/class-store";
import type { StudentFormValues } from "./_components/add-student-dialog";
import { Student } from "@/lib/type/students";

// Define the mapping function to transform student data for display
const mapStudentForDisplay = (student: Student): Student => {
  return {
    ...student,
    birth: student.birth
      ? new Date(student.birth).toLocaleDateString("vi-VN")
      : "Không rõ",
  };
};

export default function StudentsPage() {
  const { students, isLoading, error, fetchAllStudents } = useStudentStore();
  const { classes, fetchClasses } = useClassStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");

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
          (student.class && student.class.toLowerCase().includes(query))
        );
      }

      // Apply class filter if not "all"
      if (classFilter !== "all") {
        return student.class === classFilter;
      }

      return true;
    });

  useEffect(() => {
    // Fetch students and classes if not already loaded
    if (students.length === 0) {
      fetchAllStudents();
    }

    if (classes.length === 0) {
      fetchClasses();
    }
  }, [fetchAllStudents, fetchClasses, students.length, classes.length]);

  const handleAddStudent = async (data: StudentFormValues) => {
    // TODO: Implement student addition logic
    console.log("Adding student:", data);
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
            onAddStudent={handleAddStudent}
          />
          <StudentTable
            students={displayStudents}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClassStore } from "@/stores/class-store";
import { useStudentStore } from "@/stores/student-store";

interface ClassSelectorProps {
  onClassChange?: (classId: string) => void;
}

export function ClassSelector({ onClassChange }: ClassSelectorProps) {
  const { classes, isLoading, fetchClasses } = useClassStore();
  const { selectedClassId, setSelectedClassId, fetchStudentsByClass } =
    useStudentStore();

  useEffect(() => {
    fetchClasses();
  }, []); // Chỉ chạy một lần khi component mount

  const handleClassChange = (value: string) => {
    if (value === "all") {
      setSelectedClassId(null);
      // fetchAllStudents(); // Function not available, will fetch by class instead
    } else {
      setSelectedClassId(value);
      fetchStudentsByClass(value);
    }

    if (onClassChange) {
      onClassChange(value);
    }
  };

  return (
    <Select
      value={selectedClassId || "all"}
      onValueChange={handleClassChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[200px] border-blue-200">
        <SelectValue placeholder="Chọn lớp" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả lớp</SelectItem>
        {classes.map((cls) => (
          <SelectItem key={cls._id} value={cls._id}>
            {cls.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

'use client'
import { useParentStudentsStore } from "@/stores/parent-students-store";
import ImportantNoti from "./_components/important-noti";
import NotiList from "./_components/noti-list";
import { useEffect } from "react";

export default function EventsPage() {
  const { studentsData, isLoading, fetchStudentsByParent, updateStudent } =
    useParentStudentsStore();

  useEffect(() => {
    fetchStudentsByParent();
  }, [fetchStudentsByParent]);
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Thông báo sự kiện y tế
          </h1>
          <p className="text-blue-600">
            Thông báo các sự kiện y tế trong trường học
          </p>
        </div>
      </div>
      <ImportantNoti />
      <NotiList />
    </div>
  );
}

'use client'
import { useParentStudentsStore } from "@/stores/parent-students-store";
import Overall from "./_components/overall";
import RegularResultsPage from "./_components/regular-result";
import { useEffect } from "react";

export default function RegularResult() {
  const { fetchStudentsByParent } = useParentStudentsStore();

  useEffect(() => {
    fetchStudentsByParent();
  }, [fetchStudentsByParent]);
  return (
    <div className="flex flex-col gap-12">
      <Overall />
      <RegularResultsPage />
    </div>
  );
}

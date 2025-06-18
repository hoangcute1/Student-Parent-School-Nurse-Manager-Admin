"use client";

import { useEffect, useState } from "react";
import type { Staff as ApiStaff } from "../../../lib/type/staff";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FilterBar } from "./_components/filter-bar";
import { useStaffStore } from "@/stores/staff-store";
import { StaffFormValues } from "./_components/add-staff-dialog";
import { StaffTable } from "./_components/staff-table";
import { DisplayStaff } from "@/lib/type/staff";

export default function ParentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");

  const onSubmit = async (data: StaffFormValues) => {
    // try {
    //   const newStaff = await createStaff({
    //     name: data.name,
    //     phone: data.phone,
    //     address: data.address,
    //     email: data.email,
    //   });
    //   const newDisplayStaff = mapToDisplayStaff(newStaff);
    //   setStaffData((prev) => [...prev, newDisplayParent]);
    // } catch (err: any) {
    //   console.error("Failed to create parent:", err);
    //   setError(err.message);
    // }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Quản lý nhân viên
        </h1>
        <p className="text-blue-600">
          Danh sách nhân viên và thông tin liên hệ
        </p>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-800">Danh sách nhân viên</CardTitle>
          <CardDescription className="text-blue-600">
            Quản lý thông tin nhân viên trong trường
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FilterBar
            onSearchChange={setSearchQuery}
            onClassFilterChange={setClassFilter}
            onHealthStatusChange={setHealthFilter}
            onAddStaff={onSubmit}
          />
          <StaffTable />
        </CardContent>
      </Card>
    </div>
  );
}

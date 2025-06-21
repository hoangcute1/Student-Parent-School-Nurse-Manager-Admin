"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StaffTable } from "./_components/staff-table";
import { FilterBar } from "./_components/filter-bar";
import { useStaffStore } from "@/stores/staff-store";

// Define the mapping function to transform staff data for display
const mapStaffForDisplay = (staff: any) => {
  const user = staff.user || {};
  const profile = staff.profile || {};

  return {
    id: staff._id,
    name: profile.name || "",
    phone: profile.phone || "",
    address: profile.address || "",
    email: user.email || "",
    createdAt: user.created_at
      ? new Date(user.created_at).toLocaleDateString("vi-VN")
      : "Không rõ",
  };
};

export default function StaffsPage() {
  const { staffs, isLoading, error, fetchStaffs, addStaff } = useStaffStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");

  // Transform staff data for display
  const displayStaffs = staffs.map(mapStaffForDisplay).filter((staff) => {
    // Apply search filter if exists
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        staff.name.toLowerCase().includes(query) ||
        staff.email.toLowerCase().includes(query) ||
        staff.phone.toLowerCase().includes(query) ||
        staff.address.toLowerCase().includes(query)
      );
    }
    return true;
  });

  useEffect(() => {
    // Chỉ fetch khi chưa có data
    if (staffs.length === 0) {
      fetchStaffs();
    }
  }, [fetchStaffs, staffs.length]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Quản lý phụ huynh
        </h1>
        <p className="text-blue-600">
          Danh sách phụ huynh và thông tin liên hệ
        </p>
      </div>

      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-800">Danh sách phụ huynh</CardTitle>
          <CardDescription className="text-blue-600">
            Quản lý thông tin và liên lạc với phụ huynh trong trường
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FilterBar
            onSearchChange={setSearchQuery}
            onClassFilterChange={setClassFilter}
            onHealthStatusChange={setHealthFilter}
            onAddStaff={addStaff}
          />
          <StaffTable
            staffs={displayStaffs}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
}

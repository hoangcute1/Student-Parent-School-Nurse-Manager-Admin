"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useStaffStore } from "@/stores/staff-store";
import { AddStaffDialog } from "./_components/add-staff-dialog";
import { StaffTable } from "./_components/staff-table";
import { FilterBar } from "./_components/filter-bar";

export default function StaffsPage() {
  const { staffs, isLoading, error, fetchStaffs, addStaff } = useStaffStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");
  const [openAddStaff, setOpenAddStaff] = useState(false);

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
          Quản lý nhân viên
        </h1>
        <p className="text-blue-600">
          Danh sách nhân viên và thông tin liên hệ
        </p>
      </div>

      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-800">Danh sách nhân viên</CardTitle>
          <CardDescription className="text-blue-600">
            Quản lý thông tin và liên lạc với nhân viên trong trường
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 shadow transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 font-normal"
                onClick={() => setOpenAddStaff(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Thêm nhân viên
              </Button>
            </div>
            <AddStaffDialog
              open={openAddStaff}
              onOpenChange={setOpenAddStaff}
              onSubmit={async (data) => {
                await addStaff(data);
                await fetchStaffs(); // Reload lại danh sách nhân viên sau khi thêm thành công
                setOpenAddStaff(false);
              }}
              onCancel={() => setOpenAddStaff(false)}
            />
          </div>
          <FilterBar
            onSearchChange={setSearchQuery}
            onClassFilterChange={setClassFilter}
            onHealthStatusChange={setHealthFilter}
            onAddStaff={addStaff}
          />
          <StaffTable staffs={staffs} isLoading={isLoading} error={error} />
        </CardContent>
      </Card>
    </div>
  );
}

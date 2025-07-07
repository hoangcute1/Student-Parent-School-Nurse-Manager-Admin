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
import { Plus, Users, UserCheck, Shield } from "lucide-react";
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
    if (staffs.length === 0) {
      fetchStaffs();
    }
  }, [fetchStaffs, staffs.length]);

  // Calculate stats
  const totalStaffs = staffs.length;
  const activeStaffs = staffs.filter((staff) => staff.user?.email).length;
  const adminStaffs = staffs.filter(
    (staff) => staff.user?.role === "admin"
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
            Quản lý nhân viên
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quản lý thông tin nhân viên, phân quyền và theo dõi hoạt động
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng nhân viên
                  </p>
                  <p className="text-3xl font-bold text-sky-700">
                    {totalStaffs}
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
                  <p className="text-sm font-medium text-gray-600">
                    Đang hoạt động
                  </p>
                  <p className="text-3xl font-bold text-sky-700">
                    {activeStaffs}
                  </p>
                </div>
                <div className="p-3 bg-sky-100 rounded-xl">
                  <UserCheck className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Quản trị viên
                  </p>
                  <p className="text-3xl font-bold text-sky-700">
                    {adminStaffs}
                  </p>
                </div>
                <div className="p-3 bg-sky-100 rounded-xl">
                  <Shield className="w-6 h-6 text-sky-600" />
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
                  Danh sách nhân viên
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Quản lý thông tin và quyền hạn của nhân viên trong hệ thống
                </CardDescription>
              </div>
              <Button
                onClick={() => setOpenAddStaff(true)}
                className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm nhân viên
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <FilterBar
              onSearchChange={setSearchQuery}
              onClassFilterChange={setClassFilter}
              onHealthStatusChange={setHealthFilter}
              onAddStaff={addStaff}
            />
            <StaffTable staffs={staffs} isLoading={isLoading} error={error} />
          </CardContent>
        </Card>

        <AddStaffDialog
          open={openAddStaff}
          onOpenChange={setOpenAddStaff}
          onSubmit={async (data) => {
            await addStaff(data);
            await fetchStaffs();
            setOpenAddStaff(false);
          }}
          onCancel={() => setOpenAddStaff(false)}
        />
      </div>
    </div>
  );
}

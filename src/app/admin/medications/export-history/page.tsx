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
import {
  ArrowLeft,
  History,
  Calendar,
  User,
  Package,
  FileText,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ExportHistoryTable, ExportHistoryFilter } from "./_components";
import { useExportHistoryStore } from "@/stores/export-history-store";

export default function ExportHistoryPage() {
  const router = useRouter();
  const { exportHistory, isLoading, error, fetchExportHistory } =
    useExportHistoryStore();

  useEffect(() => {
    fetchExportHistory();
  }, [fetchExportHistory]);

  // Filter states
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [medicationFilter, setMedicationFilter] = useState("");
  const [staffFilter, setStaffFilter] = useState("");

  // Refresh data function
  const refreshData = () => {
    fetchExportHistory();
  };

  // Filter export history based on selected filters
  const filteredHistory = exportHistory.filter((record) => {
    // Date filter
    if (dateRange.from || dateRange.to) {
      const recordDate = new Date(record.exportDate);
      if (dateRange.from && recordDate < dateRange.from) return false;
      if (dateRange.to && recordDate > dateRange.to) return false;
    }

    // Medication name filter
    if (
      medicationFilter &&
      !record.medicineId.name
        .toLowerCase()
        .includes(medicationFilter.toLowerCase())
    ) {
      return false;
    }

    // Staff name filter
    if (
      staffFilter &&
      !record.medicalStaffName.toLowerCase().includes(staffFilter.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Calculate statistics
  const totalExports = filteredHistory.length;
  const uniqueMedications = new Set(
    filteredHistory.map((r) => r.medicineId._id)
  ).size;
  const uniqueStaff = new Set(filteredHistory.map((r) => r.medicalStaffName))
    .size;
  const totalQuantity = filteredHistory.reduce((sum, r) => sum + r.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100/50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="hover:bg-sky-100 text-sky-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-sky-800 flex items-center gap-2">
                <History className="h-8 w-8" />
                Lịch sử xuất thuốc
              </h1>
              <p className="text-sky-600 mt-1">
                Theo dõi và quản lý lịch sử xuất thuốc từ kho
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="hover:bg-sky-100 text-sky-700 border-sky-200"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/70 backdrop-blur-sm border-sky-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sky-600">Tổng lần xuất</p>
                  <p className="text-2xl font-bold text-sky-800">
                    {totalExports}
                  </p>
                </div>
                <div className="h-10 w-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-sky-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sky-600">Loại thuốc</p>
                  <p className="text-2xl font-bold text-sky-800">
                    {uniqueMedications}
                  </p>
                </div>
                <div className="h-10 w-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-sky-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sky-600">Nhân viên y tế</p>
                  <p className="text-2xl font-bold text-sky-800">
                    {uniqueStaff}
                  </p>
                </div>
                <div className="h-10 w-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-sky-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sky-600">Tổng số lượng</p>
                  <p className="text-2xl font-bold text-sky-800">
                    {totalQuantity}
                  </p>
                </div>
                <div className="h-10 w-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-sky-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-sky-100/50 border-b border-sky-200">
            <CardTitle className="text-sky-800 flex items-center gap-2">
              <History className="h-5 w-5" />
              Danh sách lịch sử xuất thuốc
            </CardTitle>
            <CardDescription className="text-sky-600">
              Hiển thị {filteredHistory.length} / {exportHistory.length} bản ghi
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Filter Section */}
            <ExportHistoryFilter
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              medicationFilter={medicationFilter}
              onMedicationFilterChange={setMedicationFilter}
              staffFilter={staffFilter}
              onStaffFilterChange={setStaffFilter}
              onClearFilters={() => {
                setDateRange({ from: undefined, to: undefined });
                setMedicationFilter("");
                setStaffFilter("");
              }}
            />

            {/* Export History Table */}
            <div className="mt-6">
              <ExportHistoryTable
                exportHistory={filteredHistory}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

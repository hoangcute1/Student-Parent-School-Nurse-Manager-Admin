"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { FilterBar } from "./_components/filter-bar";
import { useMedicationStore } from "@/stores/medication-store";
import { MedicationTable } from "./_components/medication-table";
import { MedicationFormDialog } from "./_components/medication-form-dialog";
import { UpdateMedicationDialog } from "./_components/update-medication-dialog";
import { ViewMedicationDialog } from "./_components/view-medication-dialog";
import { ExportMedicationDialog } from "./_components/export-medication-dialog";
import { Medication } from "@/lib/type/medications";
import { AddMedicationDialog } from "./_components/add-medication-dialog";
import { useCrossTabSync } from "@/hooks/useCrossTabSync";

export default function MedicationsPage() {
  // Enable cross-tab sync
  useCrossTabSync();

  const {
    medications,
    isLoading,
    error,
    fetchMedications,
    addMedication,
    updateMedication,
    deleteMedication,
    exportMedication,
  } = useMedicationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Action handlers for medications
  const handleViewMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setOpenViewDialog(true);
  };

  const handleEditMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setOpenEditDialog(true);
  };

  const handleDeleteMedication = (medication: Medication) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa thuốc "${medication.name}"?`)
    ) {
      deleteMedication(medication._id)
        .then(() => {
          fetchMedications();
        })
        .catch((err) => {
          console.error("Failed to delete medication:", err);
        });
    }
  };

  const handleExportMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setOpenExportDialog(true);
  };

  const handleExportConfirm = async (exportData: {
    medicationId: string;
    quantity: number;
    reason: string;
  }) => {
    try {
      // Sử dụng store export function - thêm default medicalStaffName
      await exportMedication({
        ...exportData,
        medicalStaffName: "System Admin", // Giá trị mặc định
      });

      // Force refresh medications để đồng bộ data
      await fetchMedications();

      // Log thông tin xuất thuốc
      console.log("Export medication:", {
        ...exportData,
        medicationName: selectedMedication?.name,
        oldQuantity: selectedMedication?.quantity,
        newQuantity: (selectedMedication?.quantity || 0) - exportData.quantity,
        exportDate: new Date().toISOString(),
      });

      alert(
        `Đã xuất thành công ${exportData.quantity} ${
          selectedMedication?.unit || "đơn vị"
        } thuốc "${selectedMedication?.name}"`
      );

      setOpenExportDialog(false);
      setSelectedMedication(null);
    } catch (error) {
      console.error("Export medication error:", error);
      throw error;
    }
  };

  // Thêm thuốc mới
  const handleAddMedication = async (data: any) => {
    await addMedication(data);
    await fetchMedications();
    setShowAddDialog(false);
  };

  // Sửa thuốc
  const handleUpdateMedication = (data: any) => {
    if (!selectedMedication) return;
    updateMedication(selectedMedication._id, data)
      .then(() => {
        fetchMedications();
        setOpenEditDialog(false);
        setSelectedMedication(null);
      })
      .catch((err) => {
        console.error("Failed to update medication:", err);
      });
  };

  // Transform Medication data for display
  const displayMedications = Array.isArray(medications)
    ? medications
        .filter((medication: any) => {
          // Apply search filter if exists
          if (searchQuery && searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            return (
              medication.name?.toLowerCase().includes(query) ||
              medication.type?.toLowerCase().includes(query) ||
              medication.description?.toLowerCase().includes(query)
            );
          }
          return true;
        })
        // Apply type filter if not "all"
        .filter((medication: any) => {
          if (typeFilter !== "all") {
            return medication.type?.toLowerCase() === typeFilter.toLowerCase();
          }
          return true;
        })
        // Sort by createdAt - newest first (mới nhất lên đầu)
        .sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime(); // Descending order (mới nhất trước)
        })
    : [];

  const handleExportToExcel = () => {
    try {
      // Chuẩn bị dữ liệu để xuất
      const exportData = displayMedications.map(
        (medication: any, index: number) => ({
          STT: index + 1,
          "Tên thuốc": medication.name || "",
          "Liều lượng": medication.dosage || "",
          "Số lượng": medication.quantity || "",
          "Đơn vị": medication.unit || "",
          "Loại thuốc": medication.type || "",
          "Hướng dẫn sử dụng": medication.usage_instructions || "",
          "Tác dụng phụ": medication.side_effects || "",
          "Chống chỉ định": medication.contraindications || "",
          "Mô tả": medication.description || "",
          "Nhà sản xuất": medication.manufacturer || "",
          "Cần đơn thuốc": medication.is_prescription_required ? "Có" : "Không",
          "Ngày tạo": medication.createdAt
            ? new Date(medication.createdAt).toLocaleDateString("vi-VN")
            : "",
        })
      );

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Thiết lập độ rộng cột
      const colWidths = [
        { wch: 5 }, // STT
        { wch: 20 }, // Tên thuốc
        { wch: 15 }, // Liều lượng
        { wch: 10 }, // Số lượng
        { wch: 10 }, // Đơn vị
        { wch: 15 }, // Loại thuốc
        { wch: 30 }, // Hướng dẫn sử dụng
        { wch: 25 }, // Tác dụng phụ
        { wch: 25 }, // Chống chỉ định
        { wch: 25 }, // Mô tả
        { wch: 20 }, // Nhà sản xuất
        { wch: 12 }, // Cần đơn thuốc
        { wch: 12 }, // Ngày tạo
      ];
      ws["!cols"] = colWidths;

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách thuốc");

      // Xuất file với tên có ngày tháng
      const fileName = `Danh_sach_thuoc_${new Date()
        .toLocaleDateString("vi-VN")
        .replace(/\//g, "_")}.xlsx`;
      XLSX.writeFile(wb, fileName);

      // Hiển thị thông báo thành công (có thể thêm toast notification)
      alert("Xuất báo cáo Excel thành công!");
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error);
      alert("Có lỗi xảy ra khi xuất báo cáo!");
    }
  };

  useEffect(() => {
    // Fetch medications when component mounts
    fetchMedications().catch((err) =>
      console.error("Failed to fetch medications:", err)
    );
  }, [fetchMedications]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl shadow-lg mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-sky-800 bg-clip-text text-transparent">
            Quản lý thuốc
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Theo dõi kho thuốc, thống kê sử dụng và quản lý tồn kho
          </p>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng loại thuốc
                  </p>
                  <p className="text-3xl font-bold text-sky-700">
                    {displayMedications.length}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">↗ +5 loại mới</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-sky-100 to-sky-200 rounded-xl">
                  <svg
                    className="w-6 h-6 text-sky-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Còn đầy đủ
                  </p>
                  <p className="text-3xl font-bold text-emerald-700">
                    {Math.floor(displayMedications.length * 0.75)}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">75% trong kho</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
                  <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sắp hết</p>
                  <p className="text-3xl font-bold text-amber-700">
                    {Math.floor(displayMedications.length * 0.15)}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">Cần bổ sung</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl">
                  <svg
                    className="w-6 h-6 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">
                  Thao tác nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  onClick={() => setShowAddDialog(true)}
                  className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white py-3 px-4 rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Thêm thuốc mới</span>
                </button>
                <button
                  onClick={() => setOpenExportDialog(true)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Xuất báo cáo thuốc</span>
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Main Data Table */}
          <div className="lg:col-span-3">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      Danh sách thuốc
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Quản lý thông tin về thuốc và hướng dẫn sử dụng
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <FilterBar
                  onSearchChange={setSearchQuery}
                  onTypeFilterChange={setTypeFilter}
                />
                <div className="mt-6">
                  <MedicationTable
                    medications={displayMedications}
                    isLoading={isLoading}
                    error={error}
                    onViewMedication={handleViewMedication}
                    onEditMedication={handleEditMedication}
                    onDeleteMedication={handleDeleteMedication}
                    onExportMedication={handleExportMedication}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <AddMedicationDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSubmit={handleAddMedication}
          onCancel={() => setShowAddDialog(false)}
        />

        <UpdateMedicationDialog
          open={openEditDialog}
          onOpenChange={setOpenEditDialog}
          medication={selectedMedication}
          onSubmit={handleUpdateMedication}
          onCancel={() => {
            setOpenEditDialog(false);
            setSelectedMedication(null);
          }}
        />

        <ViewMedicationDialog
          open={openViewDialog}
          onOpenChange={setOpenViewDialog}
          medication={selectedMedication}
          onClose={() => {
            setOpenViewDialog(false);
            setSelectedMedication(null);
          }}
        />

        <ExportMedicationDialog
          open={openExportDialog}
          onOpenChange={setOpenExportDialog}
          medication={selectedMedication}
          onConfirm={handleExportConfirm}
          onClose={() => {
            setOpenExportDialog(false);
            setSelectedMedication(null);
          }}
        />
      </div>
    </div>
  );
}

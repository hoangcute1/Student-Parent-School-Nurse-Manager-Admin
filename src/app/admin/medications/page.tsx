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
  Plus,
  Pill,
  Package,
  AlertTriangle,
  CheckCircle,
  History,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FilterBar } from "./_components/filter-bar";
import { useMedicationStore } from "@/stores/medication-store";
import { MedicationTable } from "./_components/medication-table";
import { MedicationFormDialog } from "./_components/medication-form-dialog";
import { UpdateMedicationDialog } from "./_components/update-medication-dialog";
import { ViewMedicationDialog } from "./_components/view-medication-dialog";
import { Medication } from "@/lib/type/medications";
import { AddMedicationDialog } from "./_components/add-medication-dialog";
import { useCrossTabSync } from "@/hooks/useCrossTabSync";

export default function MedicationsPage() {
  // Enable cross-tab sync
  useCrossTabSync();

  const router = useRouter();
  const {
    medications,
    isLoading,
    error,
    fetchMedications,
    addMedication,
    updateMedication,
    deleteMedication,
  } = useMedicationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
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
        // Lọc theo từ khóa tìm kiếm
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
      .filter((medication: any) => {
        // Lọc theo loại thuốc
        if (typeFilter !== "all") {
          return (
            medication.type?.toLowerCase() === typeFilter.toLowerCase()
          );
        }
        return true;
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a.created_at).getTime();
        const dateB = new Date(b.createdAt || b.created_at).getTime();
        return dateB - dateA; // 🆕 Sắp xếp mới nhất trước
      })
  : [];


  useEffect(() => {
    // Fetch medications when component mounts
    fetchMedications().catch((err) =>
      console.error("Failed to fetch medications:", err)
    );
  }, [fetchMedications]);

  // Calculate stats
  const totalMedications = displayMedications.length;
  const availableMedications = displayMedications.filter(
    (med: any) => med.quantity > 0
  ).length;
  const lowStockMedications = displayMedications.filter(
    (med: any) => med.quantity > 0 && med.quantity <= 10
  ).length;
  const outOfStockMedications = displayMedications.filter(
    (med: any) => med.quantity === 0
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl shadow-lg mb-4">
            <Pill className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-sky-800 bg-clip-text text-transparent">
            Quản lý thuốc
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quản lý kho thuốc, theo dõi tồn kho và hướng dẫn sử dụng thuốc
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <Package className="h-6 w-6 text-sky-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Tổng số thuốc
                  </p>
                  <p className="text-2xl font-bold text-sky-700">
                    {totalMedications}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Còn hàng</p>
                  <p className="text-2xl font-bold text-green-700">
                    {availableMedications}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sắp hết</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {lowStockMedications}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Hết hàng</p>
                  <p className="text-2xl font-bold text-red-700">
                    {outOfStockMedications}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <FilterBar
          onSearchChange={setSearchQuery}
          onTypeFilterChange={setTypeFilter}
          onAddMedication={addMedication}
        />

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-white border-b border-sky-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-sky-800 flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Danh sách thuốc
                </CardTitle>
                <CardDescription className="text-sky-600">
                  Quản lý thông tin về thuốc và hướng dẫn sử dụng
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push("/admin/medications/export-history")
                  }
                  className="bg-white/70 hover:bg-sky-50 text-sky-700 border-sky-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg"
                >
                  <History className="w-4 h-4 mr-2" />
                  Lịch sử xuất thuốc
                </Button>
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm thuốc mới
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <MedicationTable
              medications={displayMedications}
              isLoading={isLoading}
              error={error}
              onViewMedication={handleViewMedication}
              onEditMedication={handleEditMedication}
              onDeleteMedication={handleDeleteMedication}
            />
          </CardContent>
        </Card>

        {/* Dialogs */}
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
      </div>
    </div>
  );
};
//aaaaa//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa//aaaaa//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa//aaaaa//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa//aaaaa//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa//aaaaa//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa//aaaaa//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa//aaaaa//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa//aaaaa//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa//aaaaa//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa//aaaaa//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa//aaaaa//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa//aaaaa//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa//aaaaa//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
//aaaaa
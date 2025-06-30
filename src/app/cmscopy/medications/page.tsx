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

import { FilterBar } from "./_components/filter-bar";
import { useMedicationStore } from "@/stores/medication-store";
import { MedicationTable } from "./_components/medication-table";
import { MedicationFormDialog } from "./_components/medication-form-dialog";
import { UpdateMedicationDialog } from "./_components/update-medication-dialog";
import { ViewMedicationDialog } from "./_components/view-medication-dialog";
import { Medication } from "@/lib/type/medications";
import { AddMedicationDialog } from "./_components/add-medication-dialog";

export default function MedicationsPage() {
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
    : [];

  useEffect(() => {
    // Fetch medications when component mounts
    fetchMedications().catch((err) =>
      console.error("Failed to fetch medications:", err)
    );
  }, [fetchMedications]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Quản lý thuốc
        </h1>
        <p className="text-blue-600">Danh sách thuốc và thông tin chi tiết</p>
      </div>

      <Card className="border-blue-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-blue-800">Danh sách thuốc</CardTitle>
            <CardDescription className="text-blue-600">
              Quản lý thông tin về thuốc và hướng dẫn sử dụng
            </CardDescription>
          </div>
          {/* <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowAddDialog(true)}
          >
            + Thêm thuốc mới
          </Button>
          <AddMedicationDialog
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
            onSubmit={handleAddMedication}
            onCancel={() => setShowAddDialog(false)}
          /> */}
        </CardHeader>
        <CardContent>
          <FilterBar
            onSearchChange={setSearchQuery}
            onTypeFilterChange={setTypeFilter}
            onAddMedication={addMedication}
          />
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
  );
}

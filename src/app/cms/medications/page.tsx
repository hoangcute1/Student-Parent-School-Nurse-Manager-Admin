"use client";

import { useEffect, useState } from "react";
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


// Define the mapping function to transform medication data for display
const mapMedicationForDisplay = (medication: any) => {
  return {
    id: medication._id || "",
    name: medication.name || "Không có tên",
    type: medication.type || "Chưa phân loại",
    dosage: medication.dosage || "Không có liều lượng",
    unit: medication.unit !== undefined ? medication.unit : 0,
    usage_instructions: medication.usage_instructions || "Không có hướng dẫn",
    side_effects: medication.side_effects || "Không có tác dụng phụ",
    contraindications: medication.contraindications || "Không có chống chỉ định",
    description: medication.description || "Không có mô tả",
    created_at: medication.created_at 
      ? new Date(medication.created_at).toLocaleDateString("vi-VN") 
      : "Không rõ",
    updated_at: medication.updated_at
      ? new Date(medication.updated_at).toLocaleDateString("vi-VN")
      : "Không rõ",
  };
};

export default function MedicationsPage() {
  const { medications, isLoading, error, fetchMedications, addMedication } =
    useMedicationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Action handlers for medications
  const handleViewMedication = (medication: any) => {
    console.log("View medication:", medication);
    // TODO: Implement view medication detail dialog
  };

  const handleEditMedication = (medication: any) => {
    console.log("Edit medication:", medication);
    // TODO: Implement edit medication dialog
  };

  const handleDeleteMedication = (medication: any) => {
    console.log("Delete medication:", medication);
    if (window.confirm(`Bạn có chắc chắn muốn xóa thuốc "${medication.name}"?`)) {
      useMedicationStore.getState().deleteMedication(medication.id)
        .then(() => {
          console.log("Medication deleted successfully");
        })
        .catch(err => {
          console.error("Failed to delete medication:", err);
        });
    }
  };

  // Transform Medication data for display
  const displayMedications = Array.isArray(medications) 
  ? medications.map(mapMedicationForDisplay).filter((medication : any) => {
    // Apply search filter if exists
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        medication.name.toLowerCase().includes(query) ||
        medication.type.toLowerCase().includes(query) ||
        medication.description.toLowerCase().includes(query)
      );
    }
    return true;
  })
  // Apply type filter if not "all"
  .filter((medication) => {
    if (typeFilter !== "all") {
      return medication.type.toLowerCase() === typeFilter.toLowerCase();
    }
    return true;
  })
  : [];

  useEffect(() => {
    // Fetch medications when component mounts
    fetchMedications().catch(err => 
      console.error("Failed to fetch medications:", err)
    );
  }, [fetchMedications]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Quản lý thuốc
        </h1>
        <p className="text-blue-600">
          Danh sách thuốc và thông tin chi tiết
        </p>
      </div>

      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-800">Danh sách thuốc</CardTitle>
          <CardDescription className="text-blue-600">
            Quản lý thông tin về thuốc và hướng dẫn sử dụng
          </CardDescription>
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
    </div>
  );
}

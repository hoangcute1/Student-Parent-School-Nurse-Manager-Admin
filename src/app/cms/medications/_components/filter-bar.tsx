"use client";

import { Search, Filter, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AddMedicationDialog,
  MedicationFormValues,
} from "./add-medication-dialog";

interface FilterBarProps {
  onSearchChange?: (value: string) => void;
  onTypeFilterChange?: (value: string) => void;
  onAddMedication: (data: MedicationFormValues) => Promise<void>;
}

export function FilterBar({
  onSearchChange,
  onTypeFilterChange,
  onAddMedication,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
        <Input
          type="search"
          placeholder="Tìm kiếm theo tên thuốc, mã thuốc..."
          className="pl-8 border-blue-200 focus:border-blue-500"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      <Select onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-[180px] border-blue-200">
          <SelectValue placeholder="Loại thuốc" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả loại</SelectItem>
          <SelectItem value="Hạ sốt">Hạ sốt</SelectItem>
          <SelectItem value="Kháng sinh">Kháng sinh</SelectItem>
          <SelectItem value="Giảm đau">Giảm đau</SelectItem>
          <SelectItem value="Vitamin">Vitamin</SelectItem>
          <SelectItem value="Kháng dị ứng">Kháng dị ứng</SelectItem>
          <SelectItem value="Khác">Khác</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        className="border-blue-200 text-blue-700 hover:bg-blue-50"
      >
        <Filter className="h-4 w-4" />
      </Button>
      <Button className="bg-blue-600 hover:bg-blue-700">
        <Download className="h-4 w-4" />
      </Button>
      <AddMedicationDialog onSubmit={onAddMedication} />
    </div>
  );
}

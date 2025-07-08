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
import { AddMedicationDialog } from "./add-medication-dialog";

interface FilterBarProps {
  onSearchChange?: (value: string) => void;
  onTypeFilterChange?: (value: string) => void;
  onAddMedication: (data: any) => Promise<void>;
}

export function FilterBar({
  onSearchChange,
  onTypeFilterChange,
  onAddMedication,
}: FilterBarProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-sky-100 space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sky-400" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên thuốc, mã thuốc..."
            className="pl-10 h-11 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg transition-all duration-200"
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Select onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-[180px] h-11 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg">
              <Filter className="w-4 h-4 mr-2 text-sky-400" />
              <SelectValue placeholder="Loại thuốc" />
            </SelectTrigger>
            <SelectContent className="border-sky-200 shadow-lg">
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
            className="h-11 px-4 border-sky-200 hover:bg-sky-50 transition-all duration-200 rounded-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>
    </div>
  );
}

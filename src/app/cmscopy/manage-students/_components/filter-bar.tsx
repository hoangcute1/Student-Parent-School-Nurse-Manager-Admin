"use client";

import { Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  onSearchChange?: (value: string) => void;
  onClassFilterChange?: (value: string) => void;
  onHealthStatusChange?: (value: string) => void;
  onExportExcel?: () => void;
}

export function FilterBar({
  onSearchChange,
  onClassFilterChange,
  onHealthStatusChange,
  onExportExcel,
}: FilterBarProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-sky-100 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sky-400" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên, mã học sinh..."
            className="pl-10 h-11 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg transition-all duration-200"
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Select onValueChange={onClassFilterChange}>
            <SelectTrigger className="w-[180px] h-11 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg">
              <Filter className="w-4 h-4 mr-2 text-sky-400" />
              <SelectValue placeholder="Chọn lớp" />
            </SelectTrigger>
            <SelectContent className="border-sky-200 shadow-lg">
              <SelectItem value="all">Tất cả lớp</SelectItem>
              <SelectItem value="1A">Lớp 1A</SelectItem>
              <SelectItem value="1B">Lớp 1B</SelectItem>
              <SelectItem value="2A">Lớp 2A</SelectItem>
              <SelectItem value="2B">Lớp 2B</SelectItem>
              <SelectItem value="3A">Lớp 3A</SelectItem>
              <SelectItem value="3B">Lớp 3B</SelectItem>
              <SelectItem value="4A">Lớp 4A</SelectItem>
              <SelectItem value="4B">Lớp 4B</SelectItem>
              <SelectItem value="5A">Lớp 5A</SelectItem>
              <SelectItem value="5B">Lớp 5B</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={onHealthStatusChange}>
            <SelectTrigger className="w-[200px] h-11 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg">
              <Filter className="w-4 h-4 mr-2 text-sky-400" />
              <SelectValue placeholder="Tình trạng sức khỏe" />
            </SelectTrigger>
            <SelectContent className="border-sky-200 shadow-lg">
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="healthy">Khỏe mạnh</SelectItem>
              <SelectItem value="needs_attention">Cần theo dõi</SelectItem>
              <SelectItem value="chronic">Bệnh mãn tính</SelectItem>
              <SelectItem value="allergies">Có dị ứng</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={onExportExcel}
            className="h-11 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl border-0"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Search, Filter, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ParentFormValues } from "./add-parent-dialog";

interface FilterBarProps {
  searchQuery?: string;
  classFilter?: string;
  healthFilter?: string;
  onSearchChange?: (value: string) => void;
  onClassFilterChange?: (value: string) => void;
  onHealthStatusChange?: (value: string) => void;
  onAddParent: (data: ParentFormValues) => Promise<void>;
}

export function FilterBar({
  searchQuery = "",
  classFilter = "all",
  healthFilter = "all",
  onSearchChange,
  onClassFilterChange,
  onHealthStatusChange,
}: FilterBarProps) {
  const hasActiveFilters =
    searchQuery || classFilter !== "all" || healthFilter !== "all";

  const clearAllFilters = () => {
    onSearchChange?.("");
    onClassFilterChange?.("all");
    onHealthStatusChange?.("all");
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-sky-100 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sky-400" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            className="pl-10 h-11 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg transition-all duration-200"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-sky-100"
              onClick={() => onSearchChange?.("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          <Select value={classFilter} onValueChange={onClassFilterChange}>
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
            </SelectContent>
          </Select>

          <Select value={healthFilter} onValueChange={onHealthStatusChange}>
            <SelectTrigger className="w-[200px] h-11 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg">
              <Filter className="w-4 h-4 mr-2 text-sky-400" />
              <SelectValue placeholder="Tình trạng sức khỏe" />
            </SelectTrigger>
            <SelectContent className="border-sky-200 shadow-lg">
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="healthy">Khỏe mạnh</SelectItem>
              <SelectItem value="needs_attention">Cần theo dõi</SelectItem>
              <SelectItem value="chronic">Bệnh mãn tính</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="h-11 px-4 border-sky-200 hover:bg-sky-50 transition-all duration-200 rounded-lg"
            >
              <X className="w-4 h-4 mr-2" />
              Xóa bộ lọc
            </Button>
          )}

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

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
import { StaffFormValues } from "./add-staff-dialog";

interface FilterBarProps {
  onSearchChange?: (value: string) => void;
  onClassFilterChange?: (value: string) => void;
  onHealthStatusChange?: (value: string) => void;
  onAddStaff: (data: StaffFormValues) => Promise<void>;
}

export function FilterBar({
  onSearchChange,
  onClassFilterChange,
  onHealthStatusChange,
}: FilterBarProps) {
  return (
    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-gray-100 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên, email, chức vụ..."
            className="pl-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-lg transition-all duration-200"
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Select onValueChange={onClassFilterChange}>
            <SelectTrigger className="w-[180px] h-11 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-lg">
              <Filter className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Phòng ban" />
            </SelectTrigger>
            <SelectContent className="border-gray-200 shadow-lg">
              <SelectItem value="all">Tất cả phòng ban</SelectItem>
              <SelectItem value="admin">Hành chính</SelectItem>
              <SelectItem value="teacher">Giáo viên</SelectItem>
              <SelectItem value="medical">Y tế</SelectItem>
              <SelectItem value="support">Hỗ trợ</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={onHealthStatusChange}>
            <SelectTrigger className="w-[200px] h-11 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-lg">
              <Filter className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="border-gray-200 shadow-lg">
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Tạm nghỉ</SelectItem>
              <SelectItem value="vacation">Nghỉ phép</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="h-11 px-4 border-gray-200 hover:bg-gray-50 transition-all duration-200 rounded-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>
    </div>
  );
}

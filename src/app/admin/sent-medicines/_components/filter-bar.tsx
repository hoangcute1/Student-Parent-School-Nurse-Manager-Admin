"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  searchValue?: string;
  statusValue?: string;
}

export function FilterBar({
  onSearchChange,
  onStatusFilterChange,
  searchValue = "",
  statusValue = "all",
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm theo tên học sinh hoặc thuốc..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white/90 backdrop-blur-sm border-sky-200 focus:border-sky-400 focus:ring-sky-200"
        />
      </div>
      <Select value={statusValue} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full md:w-48 bg-white/90 backdrop-blur-sm border-sky-200 focus:border-sky-400 focus:ring-sky-200">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="pending">Chờ xử lý</SelectItem>
          <SelectItem value="progress">Đang làm</SelectItem>
          <SelectItem value="completed">Đã hoàn thành</SelectItem>
          <SelectItem value="cancelled">Đã huỷ</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

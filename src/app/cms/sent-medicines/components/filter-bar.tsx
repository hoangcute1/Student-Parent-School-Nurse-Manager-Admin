"use client";

import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
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
  onDateFilterChange: (value: string) => void;
}

export function FilterBar({
  onSearchChange,
  onStatusFilterChange,
  onDateFilterChange,
}: FilterBarProps) {
  const [searchValue, setSearchValue] = useState("");
  // Thêm state cho filter thời gian nếu cần
  const [selectedDate, setSelectedDate] = useState("today");

  useEffect(() => {
    onDateFilterChange("today");
  }, [onDateFilterChange]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange(value);
  };


  return (
    <div className="bg-sky-50/50 p-4 rounded-lg border border-sky-100">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-5 h-5 text-sky-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Bộ lọc & Tìm kiếm
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tìm kiếm</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm theo tên học sinh, thuốc, phụ huynh..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 border-sky-200 focus:border-sky-500 focus:ring-sky-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Trạng thái
          </label>
          <Select onValueChange={onStatusFilterChange} defaultValue="all">
            <SelectTrigger className="border-sky-200 focus:border-sky-500 focus:ring-sky-200">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="completed">Đã hoàn thành</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Thời gian</label>
          <Select
            onValueChange={value => {
              setSelectedDate(value);
              onDateFilterChange(value);
            }}
            value={selectedDate}
            defaultValue="today"
          >
            <SelectTrigger className="border-sky-200 focus:border-sky-500 focus:ring-sky-200">
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="all">Tất cả thời gian</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

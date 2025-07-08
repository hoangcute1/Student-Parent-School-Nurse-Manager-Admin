"use client";

import { useState } from "react";
import { Calendar, Filter, Search, X, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ExportHistoryFilterProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  onDateRangeChange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  medicationFilter: string;
  onMedicationFilterChange: (value: string) => void;
  staffFilter: string;
  onStaffFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

export function ExportHistoryFilter({
  dateRange,
  onDateRangeChange,
  medicationFilter,
  onMedicationFilterChange,
  staffFilter,
  onStaffFilterChange,
  onClearFilters,
}: ExportHistoryFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const hasActiveFilters =
    dateRange.from ||
    dateRange.to ||
    medicationFilter.trim() !== "" ||
    staffFilter.trim() !== "";

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-sky-600" />
          <h3 className="text-lg font-semibold text-sky-800">Bộ lọc</h3>
          {hasActiveFilters && (
            <span className="bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded-full">
              Đã áp dụng
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="text-sky-700 hover:bg-sky-100"
          >
            {isFilterOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-sky-700 border-sky-200 hover:bg-sky-50"
            >
              <X className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      {isFilterOpen && (
        <div className="bg-gradient-to-r from-sky-50 to-sky-100/50 rounded-lg p-4 border border-sky-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-sky-700">
                Từ ngày
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-sky-200 hover:bg-sky-50"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-sky-600" />
                    {dateRange.from ? (
                      format(dateRange.from, "dd/MM/yyyy", { locale: vi })
                    ) : (
                      <span className="text-sky-500">Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 border-sky-200"
                  align="start"
                >
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) =>
                      onDateRangeChange({ ...dateRange, from: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-sky-700">
                Đến ngày
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-sky-200 hover:bg-sky-50"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-sky-600" />
                    {dateRange.to ? (
                      format(dateRange.to, "dd/MM/yyyy", { locale: vi })
                    ) : (
                      <span className="text-sky-500">Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 border-sky-200"
                  align="start"
                >
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) =>
                      onDateRangeChange({ ...dateRange, to: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Medication Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-sky-700">
                Tên thuốc
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sky-400" />
                <Input
                  placeholder="Tìm theo tên thuốc..."
                  value={medicationFilter}
                  onChange={(e) => onMedicationFilterChange(e.target.value)}
                  className="pl-10 border-sky-200 focus:border-sky-400"
                />
              </div>
            </div>

            {/* Staff Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-sky-700">
                Nhân viên y tế
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sky-400" />
                <Input
                  placeholder="Tìm theo tên nhân viên..."
                  value={staffFilter}
                  onChange={(e) => onStaffFilterChange(e.target.value)}
                  className="pl-10 border-sky-200 focus:border-sky-400"
                />
              </div>
            </div>
          </div>

          {/* Quick Date Filters */}
          <div className="mt-4 pt-4 border-t border-sky-200">
            <Label className="text-sm font-medium text-sky-700 block mb-2">
              Lọc nhanh theo thời gian
            </Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  onDateRangeChange({ from: today, to: today });
                }}
                className="text-sky-700 border-sky-200 hover:bg-sky-50"
              >
                Hôm nay
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const weekAgo = new Date(
                    today.getTime() - 7 * 24 * 60 * 60 * 1000
                  );
                  onDateRangeChange({ from: weekAgo, to: today });
                }}
                className="text-sky-700 border-sky-200 hover:bg-sky-50"
              >
                7 ngày qua
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const monthAgo = new Date(
                    today.getTime() - 30 * 24 * 60 * 60 * 1000
                  );
                  onDateRangeChange({ from: monthAgo, to: today });
                }}
                className="text-sky-700 border-sky-200 hover:bg-sky-50"
              >
                30 ngày qua
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const startOfMonth = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                  );
                  onDateRangeChange({ from: startOfMonth, to: today });
                }}
                className="text-sky-700 border-sky-200 hover:bg-sky-50"
              >
                Tháng này
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

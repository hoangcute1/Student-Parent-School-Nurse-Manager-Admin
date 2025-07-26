"use client";

import { useState } from "react";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SearchAdvancedProps {
  searchQuery: string;
  classFilter: string;
  healthFilter: string;
  onSearchChange: (value: string) => void;
  onClassFilterChange: (value: string) => void;
  onHealthStatusChange: (value: string) => void;
  onClearAll: () => void;
}

export function SearchAdvanced({
  searchQuery,
  classFilter,
  healthFilter,
  onSearchChange,
  onClassFilterChange,
  onHealthStatusChange,
  onClearAll,
}: SearchAdvancedProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const hasActiveFilters =
    searchQuery || classFilter !== "all" || healthFilter !== "all";

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-sky-100 space-y-4">
      {/* Basic Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sky-400" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên, email, chức vụ, số điện thoại..."
            className="pl-10 h-11 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg transition-all duration-200"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-sky-100"
              onClick={() => onSearchChange("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="h-11 px-4 border-sky-200 hover:bg-sky-50 transition-all duration-200 rounded-lg"
              >
                <Filter className="w-4 h-4 mr-2" />
                Bộ lọc nâng cao
                {isAdvancedOpen ? (
                  <ChevronUp className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2" />
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearAll}
              className="h-11 px-4 border-sky-200 hover:bg-sky-50 transition-all duration-200 rounded-lg"
            >
              <X className="w-4 h-4 mr-2" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-sky-100">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Phòng ban
              </label>
              <Select value={classFilter} onValueChange={onClassFilterChange}>
                <SelectTrigger className="h-11 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg">
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent className="border-sky-200 shadow-lg">
                  <SelectItem value="all">Tất cả phòng ban</SelectItem>
                  <SelectItem value="admin">Hành chính</SelectItem>
                  <SelectItem value="teacher">Giáo viên</SelectItem>
                  <SelectItem value="medical">Y tế</SelectItem>
                  <SelectItem value="support">Hỗ trợ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Trạng thái
              </label>
              <Select value={healthFilter} onValueChange={onHealthStatusChange}>
                <SelectTrigger className="h-11 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent className="border-sky-200 shadow-lg">
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Tạm nghỉ</SelectItem>
                  <SelectItem value="vacation">Nghỉ phép</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Có thông tin liên lạc
              </label>
              <Select>
                <SelectTrigger className="h-11 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent className="border-sky-200 shadow-lg">
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="email">Có email</SelectItem>
                  <SelectItem value="phone">Có số điện thoại</SelectItem>
                  <SelectItem value="both">
                    Có cả email và số điện thoại
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-sky-100">
          <span className="text-sm text-gray-600">Bộ lọc đang hoạt động:</span>
          {searchQuery && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
              Tìm kiếm: "{searchQuery}"
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0 hover:bg-sky-200"
                onClick={() => onSearchChange("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </span>
          )}
          {classFilter !== "all" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
              Phòng ban:{" "}
              {classFilter === "admin"
                ? "Hành chính"
                : classFilter === "teacher"
                ? "Giáo viên"
                : classFilter === "medical"
                ? "Y tế"
                : "Hỗ trợ"}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0 hover:bg-sky-200"
                onClick={() => onClassFilterChange("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </span>
          )}
          {healthFilter !== "all" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
              Trạng thái:{" "}
              {healthFilter === "active"
                ? "Đang hoạt động"
                : healthFilter === "inactive"
                ? "Tạm nghỉ"
                : "Nghỉ phép"}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0 hover:bg-sky-200"
                onClick={() => onHealthStatusChange("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

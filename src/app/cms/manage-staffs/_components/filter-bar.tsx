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
import { AddStaffDialog } from "./add-staff-dialog";
import type { StaffFormValues } from "./add-staff-dialog";

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
  onAddStaff,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
        <Input
          type="search"
          placeholder="Tìm kiếm theo tên, mã học sinh..."
          className="pl-8 border-blue-200 focus:border-blue-500"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      
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
      <AddStaffDialog onSubmit={onAddStaff} />
    </div>
  );
}

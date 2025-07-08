"use client";
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Medication } from "@/lib/type/medications";

interface MedicationTableProps {
  medications: Medication[];
  isLoading: boolean;
  error: string | null;
  onViewMedication?: (medication: Medication) => void;
  onEditMedication?: (medication: Medication) => void;
  onDeleteMedication?: (medication: Medication) => void;
}

export function MedicationTable({
  medications,
  isLoading,
  error,
  onViewMedication,
  onEditMedication,
  onDeleteMedication,
}: MedicationTableProps) {
  return (
    <div className="rounded-lg border border-sky-200 overflow-hidden bg-white/50 backdrop-blur-sm">
      <Table>
        <TableHeader className="bg-gradient-to-r from-sky-50 to-sky-100/50">
          <TableRow className="border-sky-200">
            <TableHead className="text-sky-700 font-semibold">
              Tên thuốc
            </TableHead>
            <TableHead className="text-sky-700 font-semibold">Loại</TableHead>
            <TableHead className="text-sky-700 font-semibold">
              Liều lượng
            </TableHead>
            <TableHead className="text-sky-700 font-semibold">
              Số lượng
            </TableHead>
            <TableHead className="text-sky-700 font-semibold">
              Hướng dẫn sử dụng
            </TableHead>
            <TableHead className="text-sky-700 font-semibold">
              Ngày cập nhật
            </TableHead>
            <TableHead className="text-right text-sky-700 font-semibold">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-sky-600">
                Đang tải dữ liệu...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-red-500">
                Lỗi: {error}
              </TableCell>
            </TableRow>
          ) : medications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-sky-600">
                Không có dữ liệu thuốc
              </TableCell>
            </TableRow>
          ) : (
            medications.map((medication, index) => (
              <TableRow
                key={medication._id || `${medication.name || "med"}-${index}`}
                className="hover:bg-sky-50/50 cursor-pointer border-sky-100 transition-colors duration-200"
              >
                <TableCell>
                  <div className="font-medium text-sky-800">
                    {medication.name || "Chưa có tên"}
                  </div>
                </TableCell>
                <TableCell className="text-sky-700">
                  {medication.type || "Chưa phân loại"}
                </TableCell>
                <TableCell className="text-sky-700">
                  {medication.dosage} {medication.unit}
                </TableCell>
                <TableCell className="text-sky-700">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (medication.quantity || 0) === 0
                        ? "bg-red-100 text-red-700"
                        : (medication.quantity || 0) <= 10
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {medication.quantity !== undefined
                      ? medication.quantity
                      : 0}
                  </span>
                </TableCell>
                <TableCell className="text-sky-700 max-w-[200px] truncate">
                  {medication.usage_instructions || "Không có hướng dẫn"}
                </TableCell>
                <TableCell className="text-sky-700">
                  {medication.updatedAt
                    ? new Date(medication.updatedAt).toLocaleDateString("vi-VN")
                    : "Không rõ"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sky-700 hover:bg-sky-100 rounded-lg transition-colors duration-200"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="border-sky-200 shadow-lg"
                    >
                      <DropdownMenuItem
                        className="text-sky-700 hover:bg-sky-50 transition-colors duration-200"
                        onClick={() => onViewMedication?.(medication)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-sky-700 hover:bg-sky-50 transition-colors duration-200"
                        onClick={() => onEditMedication?.(medication)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-700 hover:bg-red-50 transition-colors duration-200"
                        onClick={() => onDeleteMedication?.(medication)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

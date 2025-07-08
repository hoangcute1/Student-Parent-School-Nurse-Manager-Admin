"use client";
import { Eye, Edit, Trash2, MoreHorizontal, Package } from "lucide-react";
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
  onExportMedication?: (medication: Medication) => void;
}

export function MedicationTable({
  medications,
  isLoading,
  error,
  onViewMedication,
  onEditMedication,
  onDeleteMedication,
  onExportMedication,
}: MedicationTableProps) {
  return (
    <div className="rounded-md border border-sky-200">
      <Table>
        <TableHeader className="bg-sky-50">
          <TableRow>
            <TableHead className="text-sky-700">Tên thuốc</TableHead>
            <TableHead className="text-sky-700">Loại</TableHead>
            <TableHead className="text-sky-700">Liều lượng</TableHead>
            <TableHead className="text-sky-700">Số lượng</TableHead>
            <TableHead className="text-sky-700">Hướng dẫn sử dụng</TableHead>
            <TableHead className="text-sky-700">Ngày cập nhật</TableHead>
            <TableHead className="text-right text-sky-700">Hành động</TableHead>
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
                className="hover:bg-sky-50 cursor-pointer"
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
                  {medication.quantity !== undefined ? medication.quantity : 0}
                </TableCell>
                <TableCell className="text-sky-700">
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
                        className="text-sky-700 hover:bg-sky-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-sky-700"
                        onClick={() => onViewMedication?.(medication)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-sky-700"
                        onClick={() => onEditMedication?.(medication)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-green-700"
                        onClick={() => onExportMedication?.(medication)}
                        disabled={
                          !medication.quantity || medication.quantity <= 0
                        }
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Xuất thuốc
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-700"
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

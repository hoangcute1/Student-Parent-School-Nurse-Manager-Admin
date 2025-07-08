"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, User, FileText } from "lucide-react";
import type { ExportRecord } from "@/stores/export-history-store";

interface ExportHistoryTableProps {
  exportHistory: ExportRecord[];
  isLoading: boolean;
  error: string | null;
}

export function ExportHistoryTable({
  exportHistory,
  isLoading,
  error,
}: ExportHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-sky-200 overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-sky-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sky-600">Đang tải lịch sử xuất thuốc...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 overflow-hidden bg-red-50/50 backdrop-blur-sm">
        <div className="p-8 text-center">
          <p className="text-red-600">Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  if (exportHistory.length === 0) {
    return (
      <div className="rounded-lg border border-sky-200 overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="p-8 text-center">
          <Package className="h-12 w-12 text-sky-400 mx-auto mb-4" />
          <p className="text-sky-600">Không có lịch sử xuất thuốc</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("vi-VN"),
      time: date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getQuantityBadgeColor = (quantity: number) => {
    if (quantity >= 100) return "bg-red-100 text-red-700";
    if (quantity >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="rounded-lg border border-sky-200 overflow-hidden bg-white/50 backdrop-blur-sm">
      <Table>
        <TableHeader className="bg-gradient-to-r from-sky-50 to-sky-100/50">
          <TableRow className="border-sky-200">
            <TableHead className="text-sky-700 font-semibold">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Tên thuốc
              </div>
            </TableHead>
            <TableHead className="text-sky-700 font-semibold">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Số lượng
              </div>
            </TableHead>
            <TableHead className="text-sky-700 font-semibold">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nhân viên y tế
              </div>
            </TableHead>
            <TableHead className="text-sky-700 font-semibold">
              Lý do xuất
            </TableHead>
            <TableHead className="text-sky-700 font-semibold">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ngày xuất
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exportHistory.map((record) => {
            const { date, time } = formatDate(record.exportDate);
            return (
              <TableRow
                key={record._id}
                className="hover:bg-sky-50/50 cursor-pointer border-sky-100 transition-colors duration-200"
              >
                <TableCell>
                  <div className="font-medium text-sky-800">
                    {record.medicineId.name}
                  </div>
                  <div className="text-xs text-sky-600 mt-1">
                    ID: {record.medicineId._id}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${getQuantityBadgeColor(
                      record.quantity
                    )} font-medium`}
                  >
                    {record.quantity} {record.medicineId.unit}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="font-medium text-sky-800">
                    {record.medicalStaffName}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="max-w-[250px] text-sky-700">
                    <p className="truncate" title={record.reason}>
                      {record.reason}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sky-700">
                    <div className="font-medium">{date}</div>
                    <div className="text-sm text-sky-600">{time}</div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

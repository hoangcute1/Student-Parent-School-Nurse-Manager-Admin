import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStaffStore } from "@/stores/staff-store";
import { useEffect } from "react";

export function StaffTable() {
  const { staff, isLoading, error, fetchStaff, createStaff } = useStaffStore();

  useEffect(() => {
    // Chỉ fetch khi chưa có data
    if (staff.length === 0) {
      fetchStaff();
    }
  }, [fetchStaff, staff.length]);

  return (
    <div className="rounded-md border border-blue-200">
      <Table>
        <TableHeader className="bg-blue-50">
          <TableRow>
            <TableHead className="text-blue-700">Họ và tên</TableHead>
            <TableHead className="text-blue-700">Email</TableHead>
            <TableHead className="text-right text-blue-700">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-blue-600"
              >
                Đang tải dữ liệu...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-red-500">
                Lỗi: {error}
              </TableCell>
            </TableRow>
          ) : staff.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-blue-600"
              >
                Không có dữ liệu nhân viên
              </TableCell>
            </TableRow>
          ) : (
            staff.map((staff, index) => (
              <TableRow key={index}>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell className="text-right">
                  {/* Action buttons can be added here */}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

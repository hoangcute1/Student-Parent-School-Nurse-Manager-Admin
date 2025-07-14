"use client";

import { Eye, Plus, Delete, Bell } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Student, ViewStudent } from "@/lib/type/students";

interface StudentTableProps {
  students: Student[];
  // Added prop for student data
  isLoading: boolean;
  error?: string | null;
  onView?: (student: Student) => void;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
  onAddHealthEvent?: (student: Student) => void;
}

export function StudentTable({
  students,
  isLoading,
  error,
  onView,
  onEdit,
  onAddHealthEvent,
  onDelete,
}: StudentTableProps) {
  return (
    <div className="rounded-md border border-sky-200">
      <Table>
        <TableHeader className="bg-sky-50">
          <TableRow>
            <TableHead className="text-sky-700">Học sinh</TableHead>
            <TableHead className="text-sky-700">Mã học sinh</TableHead>
            <TableHead className="text-sky-700">Lớp</TableHead>
            <TableHead className="text-sky-700">Ngày sinh</TableHead>
            <TableHead className="text-sky-700">Giới tính</TableHead>
            <TableHead className="text-right text-sky-700 w-32">
              Thao tác
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
          ) : students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-sky-600">
                Không có dữ liệu học sinh
              </TableCell>
            </TableRow>
          ) : (
            students.map((eachStudent) => (
              <TableRow
                key={eachStudent.student._id}
                className="hover:bg-sky-50 cursor-pointer"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* Avatar removed as requested */}
                    <div>
                      <div className="font-medium text-sky-800">
                        {eachStudent.student.name || "Chưa có tên"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sky-700">
                  {eachStudent.student.studentId}
                </TableCell>
                <TableCell className="text-sky-700">
                  {eachStudent.class?.name || "Chưa phân lớp"}
                </TableCell>
                <TableCell className="text-sky-700">
                  {eachStudent.student.birth
                    ? new Date(eachStudent.student.birth)
                        .toISOString()
                        .split("T")[0]
                    : ""}
                </TableCell>
                <TableCell className="text-sky-700">
                  {eachStudent.student.gender === "male"
                    ? "Nam"
                    : eachStudent.student.gender === "female"
                    ? "Nữ"
                    : "Không rõ"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* View Profile Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView?.(eachStudent)}
                      className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 hover:border-emerald-300 hover:text-emerald-800 rounded-lg px-2 py-1 h-8 w-8 transition-all duration-200 shadow-sm hover:shadow-md"
                      title="Xem hồ sơ"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {/* Add Health Event Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddHealthEvent?.(eachStudent)}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:text-blue-800 rounded-lg px-2 py-1 h-8 w-8 transition-all duration-200 shadow-sm hover:shadow-md"
                      title="Tạo lịch tư vấn"
                    >
                      <Bell className="h-4 w-4" />
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete?.(eachStudent)}
                      className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-700 hover:from-red-100 hover:to-pink-100 hover:border-red-300 hover:text-red-800 rounded-lg px-2 py-1 h-8 w-8 transition-all duration-200 shadow-sm hover:shadow-md"
                      title="Xóa học sinh"
                    >
                      <Delete className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

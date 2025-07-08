"use client";

import { Eye, Plus, Delete } from "lucide-react";
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
  onAddStudent?: () => void; // Updated prop to trigger dialog opening
}

export function StudentTable({
  students,
  isLoading,
  error,
  onView,
  onEdit,
  onAddHealthEvent,
  onDelete,
  onAddStudent,
}: StudentTableProps) {
  return (
    <div className="rounded-md border border-blue-200">
      {/* Add Student Button */}
      <div className="p-4">
        <Button
          onClick={onAddStudent}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={!onAddStudent}
        >
          <Plus className="mr-2 h-4 w-4" /> Thêm học sinh
        </Button>
      </div>

      <Table>
        <TableHeader className="bg-blue-50">
          <TableRow>
            <TableHead className="text-blue-700">Học sinh</TableHead>
            <TableHead className="text-blue-700">Mã học sinh</TableHead>
            <TableHead className="text-blue-700">Lớp</TableHead>
            <TableHead className="text-blue-700">Ngày sinh</TableHead>
            <TableHead className="text-blue-700">Giới tính</TableHead>
            <TableHead className="text-right text-blue-700 w-48">
              Thao tác
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
          ) : students.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-blue-600"
              >
                Không có dữ liệu học sinh
              </TableCell>
            </TableRow>
          ) : (
            students.map((eachStudent) => (
              <TableRow
                key={eachStudent.student._id}
                className="hover:bg-blue-50 cursor-pointer"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-blue-200">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32&text=${
                          eachStudent.student.name?.charAt(0) || "S"
                        }`}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {eachStudent.student.name?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-blue-800">
                        {eachStudent.student.name || "Chưa có tên"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-blue-700">
                  {eachStudent.student.studentId}
                </TableCell>
                <TableCell className="text-blue-700">
                  {eachStudent.class?.name || "Chưa phân lớp"}
                </TableCell>
                <TableCell className="text-blue-700">
                  {eachStudent.student.birth
                    ? new Date(eachStudent.student.birth)
                        .toISOString()
                        .split("T")[0]
                    : ""}
                </TableCell>
                <TableCell className="text-blue-700">
                  {eachStudent.student.gender === "male"
                    ? "Nam"
                    : eachStudent.student.gender === "female"
                    ? "Nữ"
                    : "Không rõ"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* View Profile Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView?.(eachStudent)}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 hover:border-emerald-300 hover:text-emerald-800 rounded-lg px-3 py-2 h-9 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">Xem</span>
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete?.(eachStudent)}
                      className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-700 hover:from-red-100 hover:to-pink-100 hover:border-red-300 hover:text-red-800 rounded-lg px-3 py-2 h-9 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Delete className="h-4 w-4" />
                      <span className="font-medium">Xóa</span>
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

"use client";

import { Eye, Edit, MoreHorizontal, Delete, Plus } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
            <TableHead className="text-right text-sky-700">Thao tác</TableHead>
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
                    <Avatar className="h-8 w-8 border border-sky-200">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32&text=${
                          eachStudent.student.name?.charAt(0) || "S"
                        }`}
                      />
                      <AvatarFallback className="bg-sky-100 text-sky-700 text-xs">
                        {eachStudent.student.name?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
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
                        onClick={() => onView?.(eachStudent)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Xem hồ sơ
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-sky-700"
                        onClick={() => onEdit?.(eachStudent)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-sky-700"
                        onClick={() => onAddHealthEvent?.(eachStudent)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm sự cố y tế
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-700"
                        onClick={() => onDelete?.(eachStudent)}
                      >
                        <Delete className="mr-2 h-4 w-4" />
                        Xoá
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

"use client";

import { Eye, Edit, Plus, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Student } from "@/lib/type/students";

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
  error?: string | null;
}

export function StudentTable({
  students,
  isLoading,
  error,
}: StudentTableProps) {
  return (
    <div className="rounded-md border border-blue-200">
      <Table>
        <TableHeader className="bg-blue-50">
          <TableRow>
            <TableHead className="text-blue-700">Học sinh</TableHead>
            <TableHead className="text-blue-700">Mã học sinh</TableHead>
            <TableHead className="text-blue-700">Lớp</TableHead>
            <TableHead className="text-blue-700">Ngày sinh</TableHead>
            <TableHead className="text-blue-700">Giới tính</TableHead>
            <TableHead className="text-right text-blue-700">Thao tác</TableHead>
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
            students.map((student) => (
              <TableRow
                key={student._id}
                className="hover:bg-blue-50 cursor-pointer"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-blue-200">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32&text=${
                          student.name?.charAt(0) || "S"
                        }`}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {student.name?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-blue-800">
                        {student.name || "Chưa có tên"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-blue-700">
                  {student.studentId}
                </TableCell>
                {/* <TableCell className="text-blue-700">
                  {student.class || "Chưa phân lớp"}
                </TableCell> */}
                <TableCell className="text-blue-700">
                  {student.birth || "N/A"}
                </TableCell>
                <TableCell className="text-blue-700">
                  {student.gender === "male"
                    ? "Nam"
                    : student.gender === "female"
                    ? "Nữ"
                    : "Không rõ"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-700 hover:bg-blue-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-blue-700">
                        <Eye className="mr-2 h-4 w-4" />
                        Xem hồ sơ
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-blue-700">
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm sự kiện y tế
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

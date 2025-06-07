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

interface Student {
  name: string;
  studentId: string;
  class: string;
  birthDate: string;
  parent: string;
  healthStatus: string;
  lastUpdate: string;
}

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
  error: string | null;
}

function getHealthStatusVariant(status: string) {
  switch (status) {
    case "Sức khỏe tốt":
      return "default";
    case "Cần theo dõi":
      return "secondary";
    case "Khẩn cấp":
      return "destructive";
    default:
      return "outline";
  }
}

function getHealthStatusColor(status: string) {
  switch (status) {
    case "Sức khỏe tốt":
      return "bg-green-100 text-green-800";
    case "Cần theo dõi":
      return "bg-yellow-100 text-yellow-800";
    case "Khẩn cấp":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
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
            <TableHead className="text-blue-800">Học sinh</TableHead>
            <TableHead className="text-blue-800">Lớp</TableHead>
            <TableHead className="text-blue-800">Ngày sinh</TableHead>
            <TableHead className="text-blue-800">Phụ huynh</TableHead>
            <TableHead className="text-blue-800">Tình trạng sức khỏe</TableHead>
            <TableHead className="text-blue-800">Dị ứng</TableHead>
            <TableHead className="text-blue-800">Cập nhật cuối</TableHead>
            <TableHead className="text-right text-blue-800">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-10 text-blue-600"
              >
                Đang tải dữ liệu...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10 text-red-500">
                Lỗi: {error}
              </TableCell>
            </TableRow>
          ) : students.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-10 text-blue-600"
              >
                Không có dữ liệu học sinh
              </TableCell>
            </TableRow>
          ) : (
            students.map((student, index) => (
              <TableRow key={index} className="hover:bg-blue-50 cursor-pointer">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-blue-200">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32&text=${student.name.charAt(
                          0
                        )}`}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {student.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-blue-800">
                        {student.name}
                      </div>
                      <div className="text-sm text-blue-600">
                        {student.studentId}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-blue-700">{student.class}</TableCell>
                <TableCell className="text-blue-700">
                  {student.birthDate}
                </TableCell>
                <TableCell className="text-blue-700">
                  {student.parent}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getHealthStatusVariant(student.healthStatus)}
                    className={getHealthStatusColor(student.healthStatus)}
                  >
                    {student.healthStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-blue-700">
                  {student.lastUpdate}
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

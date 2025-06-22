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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Parent {
  name: string;
  phone: string;
  address: string;
  email: string;
  createdAt: string;
}

interface ParentTableProps {
  parents: Parent[];
  isLoading: boolean;
  error: string | null;
}

export function ParentTable({ parents, isLoading, error }: ParentTableProps) {
  return (
    <div className="rounded-md border border-blue-200">
      <Table>
        <TableHeader className="bg-blue-50">
          <TableRow>
            <TableHead className="text-blue-700">Họ và tên</TableHead>
            <TableHead className="text-blue-700">Số điện thoại</TableHead>
            <TableHead className="text-blue-700">Địa chỉ</TableHead>
            <TableHead className="text-blue-700">Email</TableHead>
            <TableHead className="text-blue-700">Ngày tạo</TableHead>
            <TableHead className="text-right text-blue-700">
              Hành động
            </TableHead>
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
          ) : parents.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-10 text-blue-600"
              >
                Không có dữ liệu học sinh
              </TableCell>
            </TableRow>
          ) : (
            parents.map((parent, index) => (
              <TableRow
                key={`parent-${parent.phone}-${index}`}
                className="hover:bg-blue-50 cursor-pointer"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-blue-200">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32&text=${
                          parent.name?.charAt(0) || "P"
                        }`}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {parent.name?.charAt(0) || "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-blue-800">
                        {parent.name || "Chưa có tên"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-blue-700">{parent.phone}</TableCell>
                <TableCell className="text-blue-700">
                  {parent.address}
                </TableCell>
                <TableCell className="text-blue-700">{parent.email}</TableCell>
                <TableCell className="text-blue-700">
                  {parent.createdAt}
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

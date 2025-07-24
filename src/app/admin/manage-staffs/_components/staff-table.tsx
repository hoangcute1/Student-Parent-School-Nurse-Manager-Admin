"use client";

import { Eye, Edit, Plus, MoreHorizontal, DeleteIcon } from "lucide-react";
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Staff } from "@/lib/type/staff";
import { useStaffStore } from "@/stores/staff-store";
import { ViewStaffDialog } from "./view-staff-dialog";
import { UpdateStaffDialog } from "./update-staff-dialog";
import { deleteStaff } from "@/lib/api/staff";

interface StaffTableProps {
  staffs: Staff[];
  isLoading: boolean;
  error: string | null;
}

export function StaffTable({ staffs, isLoading, error }: StaffTableProps) {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [deleteStaffState, setDeleteStaff] = useState<Staff | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const { fetchStaffs } = useStaffStore();

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
                Y tế học đường
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10 text-red-500">
                Lỗi: {error}
              </TableCell>
            </TableRow>
          ) : staffs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-10 text-blue-600"
              >
                Không có dữ liệu học sinh
              </TableCell>
            </TableRow>
          ) : (
            staffs.map((staff, index) => {
              const profile = staff.profile || {};
              const user = staff.user || {};
              return (
                <TableRow
                  key={`staff-${staff._id || index}`}
                  className="hover:bg-blue-50 cursor-pointer"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium text-blue-800">
                          {profile.name || "Chưa có tên"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-blue-700">
                    {profile.phone || "-"}
                  </TableCell>
                  <TableCell className="text-blue-700">
                    {profile.address || "-"}
                  </TableCell>
                  <TableCell className="text-blue-700">
                    {user.email || "-"}
                  </TableCell>
                  <TableCell className="text-blue-700">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("vi-VN")
                      : "-"}
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
                        <DropdownMenuItem
                          className="text-blue-700"
                          onClick={() => setSelectedStaff(staff)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem hồ sơ
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-blue-700"
                          onClick={() => setEditStaff(staff)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-700"
                          onClick={() => setDeleteStaff(staff)}
                        >
                          <DeleteIcon className="mr-2 h-4 w-4" />
                          Xoá tài khoản
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      {/* Dialog xem hồ sơ */}
      {selectedStaff && (
        <ViewStaffDialog
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
      {/* Dialog chỉnh sửa */}
      {editStaff && (
        <UpdateStaffDialog
          staff={editStaff}
          onClose={() => setEditStaff(null)}
          onSubmit={async () => {
            await fetchStaffs();
            setEditStaff(null);
          }}
        />
      )}
      {/* Dialog xác nhận xoá */}
      {deleteStaffState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
              onClick={() => setDeleteStaff(null)}
              aria-label="Đóng"
            >
              ×
            </button>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-2">
                <DeleteIcon className="text-red-600 w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-red-700 text-center">
                Xác nhận xoá tài khoản
              </h2>
              <div className="mb-4 text-center text-blue-900 text-base">
                Bạn có chắc chắn muốn xoá nhân viên{" "}
                <b className="text-red-700">
                  {deleteStaffState.profile?.name || ""}
                </b>{" "}
                không?
              </div>
              <div className="flex gap-3 justify-center w-full mt-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteStaff(null)}
                  disabled={deleting}
                  className="min-w-[90px] border-blue-300 hover:border-blue-500"
                >
                  Huỷ
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white min-w-[90px] shadow"
                  disabled={deleting}
                  onClick={async () => {
                    if (!deleteStaffState?._id) return;
                    setDeleting(true);
                    try {
                      await deleteStaff(deleteStaffState._id);
                      toast({
                        title: "Đã xoá nhân viên",
                        description:
                          "Tài khoản nhân viên đã được xoá thành công.",
                        variant: "default",
                      });
                      setDeleteStaff(null);
                      await fetchStaffs();
                    } catch (err: any) {
                      toast({
                        title: "Lỗi khi xoá",
                        description: err.message || "Không thể xoá nhân viên.",
                        variant: "destructive",
                      });
                    } finally {
                      setDeleting(false);
                    }
                  }}
                >
                  {deleting ? "Đang xoá..." : "Xoá"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
import { ViewParentDialog } from "./view-parent-dialog";
import { UpdateParentDialog } from "./update-parent-dialog";
import { Parent } from "@/lib/type/parents";
import { deleteParent } from "@/lib/api/parent";
import { useToast } from "@/hooks/use-toast";
import { useParentStore } from "@/stores/parent-store";

interface ParentTableProps {
  parents: Parent[];
  isLoading: boolean;
  error: string | null;
}

export function ParentTable({ parents, isLoading, error }: ParentTableProps) {
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [editParent, setEditParent] = useState<Parent | null>(null);
  const [deleteParentState, setDeleteParent] = useState<Parent | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const { fetchParents } = useParentStore();

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
            parents.map((parent, index) => {
              const profile = parent.profile || {};
              const user = parent.user || {};
              return (
                <TableRow
                  key={`parent-${parent._id || index}`}
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
                          onClick={() => setSelectedParent(parent)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem hồ sơ
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-blue-700"
                          onClick={() => setEditParent(parent)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-700"
                          onClick={() => setDeleteParent(parent)}
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
      {selectedParent && (
        <ViewParentDialog
          parent={selectedParent}
          onClose={() => setSelectedParent(null)}
        />
      )}
      {/* Dialog chỉnh sửa */}
      {editParent && (
        <UpdateParentDialog
          parent={editParent}
          onClose={() => setEditParent(null)}
          onSubmit={async () => {
            await fetchParents();
            setEditParent(null);
          }}
        />
      )}
      {/* Dialog xác nhận xoá */}
      {deleteParentState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
              onClick={() => setDeleteParent(null)}
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
                Bạn có chắc chắn muốn xoá phụ huynh{" "}
                <b className="text-red-700">
                  {deleteParentState.profile?.name || ""}
                </b>{" "}
                không?
              </div>
              <div className="flex gap-3 justify-center w-full mt-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteParent(null)}
                  disabled={deleting}
                  className="min-w-[90px] border-blue-300 hover:border-blue-500"
                >
                  Huỷ
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white min-w-[90px] shadow"
                  disabled={deleting}
                  onClick={async () => {
                    if (!deleteParentState?._id) return;
                    setDeleting(true);
                    try {
                      await deleteParent(deleteParentState._id);
                      toast({
                        title: "Đã xoá phụ huynh",
                        description:
                          "Tài khoản phụ huynh đã được xoá thành công.",
                        variant: "default",
                      });
                      setDeleteParent(null);
                      // Có thể reload danh sách ở đây nếu cần
                      window.location.reload();
                    } catch (err: any) {
                      toast({
                        title: "Lỗi khi xoá",
                        description: err.message || "Không thể xoá phụ huynh.",
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

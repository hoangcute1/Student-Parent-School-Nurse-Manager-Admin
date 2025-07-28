"use client";

import { useEffect } from "react";
import { Clock, Eye, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMedicineDeliveryStore } from "@/stores/medicine-delivery-store";
import { useAuthStore } from "@/stores/auth-store";

import React, { useState, useCallback } from "react";
import ViewDeliveryDialog from "./_components/view-delivery-dialog";
import type { MedicineDeliveryByParent } from "@/lib/type/medicine-delivery";
import AddMedicineDeliveryForm from "./_components/add-medications-dialog";
import { useParentStudentsStore } from "@/stores/parent-students-store";

// Tách TableRow thành component con để tối ưu render
const DeliveryRow = React.memo(function DeliveryRow({
  delivery,
  onShowDetail,
  onDelete,
  deletingId,
  updatedAt,
}: {
  delivery: MedicineDeliveryByParent;
  onShowDetail: (delivery: MedicineDeliveryByParent) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
  updatedAt: string | null;
}) {
  return (
    <TableRow
      key={delivery.id}
      className="hover:bg-sky-50 transition-colors border-sky-100"
    >
      <TableCell className="font-medium text-sky-900">
        {delivery.student?.name || "N/A"}
      </TableCell>
      <TableCell className="font-medium text-sky-900">
        {delivery.name || "N/A"}
      </TableCell>
      <TableCell className="font-medium text-sky-900">
        {delivery.total || 0}
      </TableCell>
      <TableCell>
        <div className="flex items-center text-sky-700">
          <Clock className="mr-2 h-4 w-4 text-sky-500" />
          <span className="font-medium">{delivery.per_day}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className={
            delivery.status === "completed"
              ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
              : delivery.status === "cancelled"
              ? "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
              : delivery.status === "morning" || delivery.status === "noon"
              ? "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
              : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
          }
        >
          {delivery.status === "pending"
            ? "Chờ xử lý"
            : delivery.status === "morning"
            ? "Đã uống vào buổi sáng"
            : delivery.status === "noon"
            ? "Đã uống vào buổi trưa"
            : delivery.status === "completed"
            ? "Đã hoàn thành"
            : delivery.status === "cancelled"
            ? "Đã huỷ"
            : delivery.status}
        </Badge>
      </TableCell>
      <TableCell className="font-medium text-sky-900">
        {updatedAt
          ? new Date(updatedAt).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Chưa có thông tin"}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShowDetail(delivery)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 hover:border-emerald-300 hover:text-emerald-800 rounded-lg px-3 py-2 h-9 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(delivery.id)}
            disabled={deletingId === delivery.id}
            className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-teal-50 border-red-200 text-red-700 hover:from-red-100 hover:to-teal-100 hover:border-red-300 hover:text-red-800 rounded-lg px-3 py-2 h-9 transition-all duration-200 shadow-sm hover:shadow-md"
            title="Xóa hoàn toàn đơn thuốc khỏi hệ thống. Quản trị viên và nhân viên y tế cũng sẽ không thể thấy đơn này."
          >
            <X className="h-4 w-4" />
            {deletingId === delivery.id}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

export default function MedicationsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const {
    medicineDeliveryByParentId,
    isLoading,
    fetchMedicineDeliveryByParentId,
    deleteMedicineDelivery,
  } = useMedicineDeliveryStore();
  const { fetchStudentsByParent } = useParentStudentsStore();

  useEffect(() => {
    fetchStudentsByParent();
  }, [fetchStudentsByParent]);
  const [selectedDelivery, setSelectedDelivery] =
    useState<MedicineDeliveryByParent | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMedicineDeliveryByParentId();
    }
  }, [isAuthenticated, user, fetchMedicineDeliveryByParentId]);

  const handleShowDetail = useCallback((delivery: MedicineDeliveryByParent) => {
    setSelectedDelivery(delivery);
    setShowDetail(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!id) {
        alert("Không tìm thấy ID đơn thuốc để xoá!");
        return;
      }
      console.log("Attempting to delete medicine delivery with ID:", id);
      if (
        !window.confirm(
          "⚠️ LƯU Ý: Bạn có chắc muốn xoá hoàn toàn đơn thuốc này?\n\n" +
            "Khi xóa, đơn thuốc sẽ bị XÓA HOÀN TOÀN khỏi hệ thống, " +
            "bao gồm cả view của quản trị viên và nhân viên y tế.\n\n" +
            "Hành động này KHÔNG THỂ HOÀN TÁC!"
        )
      )
        return;
      setDeletingId(id);
      try {
        console.log("Calling deleteMedicineDelivery...");
        await deleteMedicineDelivery(id);
        console.log("Delete successful, refreshing data...");
        await fetchMedicineDeliveryByParentId();
        console.log("Data refreshed successfully");
        alert("✅ Đã xóa đơn thuốc thành công!");
      } catch (error) {
        console.error("Delete failed:", error);
        alert("❌ Xoá thất bại! Vui lòng thử lại.");
      }
      setDeletingId(null);
    },
    [deleteMedicineDelivery, fetchMedicineDeliveryByParentId]
  );

  const handleAddSuccess = useCallback(() => {
    setIsAddDialogOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-sky-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-sky-800">
                💊 Quản lý thuốc học sinh
              </h1>
              <p className="text-sky-600 text-lg">
                Theo dõi và quản lý việc gửi thuốc cho học sinh
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Thêm đơn thuốc
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-2xl border-sky-200 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-sky-800">
                    Thêm đơn thuốc mới
                  </DialogTitle>
                  <DialogDescription className="text-sky-600">
                    Nhập thông tin đơn thuốc cho học sinh
                  </DialogDescription>
                </DialogHeader>
                <AddMedicineDeliveryForm onSuccess={handleAddSuccess} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-sky-200 overflow-hidden">
          <div className="p-6 border-b border-sky-100">
            <h2 className="text-xl font-semibold text-sky-800">
              Danh sách đơn thuốc
            </h2>
            <p className="text-sky-600 mt-1">Tổng quan các đơn thuốc đã gửi</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gradient-to-r from-sky-100 to-blue-100">
                <TableRow className="border-sky-200">
                  <TableHead className="text-sky-800 font-semibold">
                    Tên học sinh
                  </TableHead>
                  <TableHead className="text-sky-800 font-semibold">
                    Tên thuốc
                  </TableHead>
                  <TableHead className="text-sky-800 font-semibold">
                    Số liều
                  </TableHead>
                  <TableHead className="text-sky-800 font-semibold">
                    Thời gian dùng
                  </TableHead>
                  <TableHead className="text-sky-800 font-semibold">
                    Trạng thái
                  </TableHead>
                  <TableHead className="text-sky-800 font-semibold">
                    Cập nhật lần cuối
                  </TableHead>
                  <TableHead className="text-center text-sky-800 font-semibold">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-blue-700 text-2xl font-bold tracking-wide animate-pulse">
                          Y tế học đường
                        </p>
                        <p className="text-blue-400 text-base mt-2">
                          Vui lòng chờ trong giây lát...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : medicineDeliveryByParentId.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="text-4xl">📭</div>
                        <p className="text-sky-600 text-lg">
                          Không có đơn thuốc nào
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  medicineDeliveryByParentId.map((delivery, idx) => (
                    <DeliveryRow
                      key={delivery.id || idx}
                      delivery={delivery}
                      onShowDetail={handleShowDetail}
                      onDelete={handleDelete}
                      deletingId={deletingId}
                      updatedAt={delivery.updated_at}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal chi tiết đơn thuốc */}
      {showDetail && selectedDelivery && (
        <ViewDeliveryDialog
          delivery={selectedDelivery as MedicineDeliveryByParent}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}

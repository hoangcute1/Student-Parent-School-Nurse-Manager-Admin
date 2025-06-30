import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {  MedicineDeliveryByStaff } from "@/lib/type/medicine-delivery";

interface ViewDeliveryDialogProps {
  delivery: MedicineDeliveryByStaff;
  onClose: () => void;
}

export function ViewDeliveryDialog({
  delivery,
  onClose,
}: ViewDeliveryDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-lg shadow-lg border border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-blue-700 text-xl font-bold mb-2 text-left">
            Chi tiết đơn gửi thuốc
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2 items-start">
          <div className="text-lg font-semibold text-blue-900 mb-1">
            {delivery.student?.name || "-"}
          </div>
          <div className="w-full flex flex-col gap-1 text-blue-800 text-base">
            <div className="flex justify-between">
              <span className="font-medium">Lớp:</span>
              <span>{delivery.student?.class?.name || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Người gửi:</span>
              <span>{delivery.parentName || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Thuốc:</span>
              <span>{delivery.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Số lượng:</span>
              <span>{delivery.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Số lần uống/ngày:</span>
              <span>{delivery.per_day}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Liều/lần:</span>
              <span>{delivery.per_dose}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Ghi chú:</span>
              <span>{delivery.note || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Lý do:</span>
              <span>{delivery.reason || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Ngày bắt đầu:</span>
              <span>
                {delivery.created_at
                  ? new Date(delivery.created_at).toLocaleDateString("vi-VN")
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Ngày kết thúc:</span>
              <span>
                {delivery.end_at
                  ? new Date(delivery.end_at).toLocaleDateString("vi-VN")
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Trạng thái:</span>
              <span
                className={
                  delivery.status === "pending"
                    ? "text-yellow-600"
                    : delivery.status === "progress"
                    ? "text-blue-600"
                    : delivery.status === "completed"
                    ? "text-green-600"
                    : delivery.status === "cancelled"
                    ? "text-red-600"
                    : ""
                }
              >
                {delivery.status === "pending"
                  ? "Chờ xử lí"
                  : delivery.status === "progress"
                  ? "Đang làm"
                  : delivery.status === "completed"
                  ? "Đã hoàn thành"
                  : delivery.status === "cancelled"
                  ? "Đã huỷ"
                  : delivery.status}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full mt-2 border-blue-300 text-blue-800 font-semibold hover:bg-blue-50"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

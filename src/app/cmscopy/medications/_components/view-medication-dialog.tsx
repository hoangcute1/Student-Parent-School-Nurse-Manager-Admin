import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Medication } from "@/lib/type/medications";

interface ViewMedicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medication: Medication | null;
  onClose: () => void;
}

export const ViewMedicationDialog: React.FC<ViewMedicationDialogProps> = ({
  open,
  onOpenChange,
  medication,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết thuốc</DialogTitle>
        </DialogHeader>
        {medication ? (
          <div className="grid grid-cols-1 gap-3 bg-sky-50 rounded-lg p-4 border border-sky-100 shadow-sm">
            <div className="flex items-center">
              <span className="w-50 font-semibold text-sky-700">
                Mã thuốc (ID):
              </span>
              <span className="ml-2 text-sky-900">{medication._id}</span>
            </div>
            <div className="flex items-center">
              <span className="w-50 font-semibold text-sky-700">
                Tên thuốc:
              </span>
              <span className="ml-2 text-sky-900">{medication.name}</span>
            </div>
            <div className="flex items-center">
              <span className="w-50 font-semibold text-sky-700">
                Loại thuốc:
              </span>
              <span className="ml-2 text-sky-900">
                {medication.type || "-"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-50 font-semibold text-sky-700">
                Liều lượng:
              </span>
              <span className="ml-2 text-sky-900">
                {medication.dosage || "-"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-50 font-semibold text-sky-700">
                Số lượng:
              </span>
              <span className="ml-2 text-sky-900">
                {medication.quantity !== undefined ? medication.quantity : "-"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-50 font-semibold text-sky-700">Đơn vị:</span>
              <span className="ml-2 text-sky-900">
                {medication.unit || "-"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-50 font-semibold text-sky-700">
                Nhà sản xuất:
              </span>
              <span className="ml-2 text-sky-900">
                {medication.manufacturer || "-"}
              </span>
            </div>
            <div className="flex items-start">
              <span className="w-50 font-semibold text-sky-700">
                Hướng dẫn sử dụng:
              </span>
              <span className="ml-2 text-sky-900 whitespace-pre-line">
                {medication.usage_instructions || "-"}
              </span>
            </div>
            <div className="flex items-start">
              <span className="w-50 font-semibold text-sky-700">
                Tác dụng phụ:
              </span>
              <span className="ml-2 text-sky-900 whitespace-pre-line">
                {medication.side_effects || "-"}
              </span>
            </div>
            <div className="flex items-start">
              <span className="w-50 font-semibold text-sky-700">
                Chống chỉ định:
              </span>
              <span className="ml-2 text-sky-900 whitespace-pre-line">
                {medication.contraindications || "-"}
              </span>
            </div>
            <div className="flex items-start">
              <span className="w-50 font-semibold text-sky-700">Mô tả:</span>
              <span className="ml-2 text-sky-900 whitespace-pre-line">
                {medication.description || "-"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-50 font-semibold text-sky-700">
                Ngày tạo:
              </span>
              <span className="ml-2 text-sky-900">
                {medication.createdAt
                  ? new Date(medication.createdAt).toLocaleString()
                  : "-"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-50 font-semibold text-sky-700">
                Ngày cập nhật:
              </span>
              <span className="ml-2 text-sky-900">
                {medication.updatedAt
                  ? new Date(medication.updatedAt).toLocaleString()
                  : "-"}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Không có dữ liệu thuốc.</div>
        )}
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

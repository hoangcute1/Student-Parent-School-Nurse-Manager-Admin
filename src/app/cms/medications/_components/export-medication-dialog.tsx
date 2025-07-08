import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, AlertTriangle } from "lucide-react";
import { Medication } from "@/lib/type/medications";

interface ExportMedicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medication: Medication | null;
  onConfirm: (exportData: {
    medicationId: string;
    quantity: number;
    reason: string;
  }) => void;
  onClose: () => void;
}

export const ExportMedicationDialog: React.FC<ExportMedicationDialogProps> = ({
  open,
  onOpenChange,
  medication,
  onConfirm,
  onClose,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!medication || !reason.trim()) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (quantity <= 0 || quantity > (medication.quantity || 0)) {
      alert("Số lượng xuất không hợp lệ");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm({
        medicationId: medication._id,
        quantity,
        reason: reason.trim(),
      });

      // Reset form
      setQuantity(1);
      setReason("");
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      alert("Có lỗi xảy ra khi xuất thuốc");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setQuantity(1);
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <Package className="h-5 w-5" />
            Xuất thuốc từ kho
          </DialogTitle>
        </DialogHeader>

        {medication ? (
          <div className="space-y-4">
            {/* Thông tin thuốc */}
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">
                Thông tin thuốc
              </h4>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Tên:</span> {medication.name}
                </div>
                <div>
                  <span className="font-medium">Loại:</span>{" "}
                  {medication.type || "Không rõ"}
                </div>
                <div>
                  <span className="font-medium">Tồn kho:</span>{" "}
                  {medication.quantity || 0} {medication.unit}
                </div>
              </div>
            </div>

            {/* Form xuất thuốc */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Số lượng xuất <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={medication.quantity || 0}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
                {quantity > (medication.quantity || 0) && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    Số lượng xuất vượt quá tồn kho
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="reason" className="text-sm font-medium">
                  Lý do xuất <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Nhập lý do xuất thuốc (ví dụ: Điều trị cho học sinh, Bổ sung phòng y tế...)"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Không có thông tin thuốc
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !medication ||
              !reason.trim() ||
              quantity <= 0 ||
              quantity > (medication.quantity || 0)
            }
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận xuất"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

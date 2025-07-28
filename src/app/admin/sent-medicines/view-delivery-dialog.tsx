import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  User,
  Pill,
  Clock,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  Activity,
  X,
} from "lucide-react";
import { MedicineDelivery } from "@/lib/type/medicine-delivery";

interface ViewDeliveryDialogProps {
  delivery: MedicineDelivery;
  onClose: () => void;
}

export function ViewDeliveryDialog({
  delivery,
  onClose,
}: ViewDeliveryDialogProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "progress":
        return "Đang thực hiện";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "morning":
        return <Activity className="w-4 h-4" />;
      case "noon":
        return <Activity className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-sky-200">
        <DialogHeader className="border-b border-sky-100 pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
              <Pill className="w-5 h-5 text-sky-600" />
            </div>
            Chi tiết đơn thuốc
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Card */}
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg p-4 border border-sky-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 mb-3">
                Trạng thái đơn thuốc
              </h3>
              <Badge
                variant="secondary"
                className={`${getStatusColor(
                  delivery.status
                )} flex items-center gap-1`}
              >
                {getStatusIcon(delivery.status)}
                {getStatusText(delivery.status)}
              </Badge>
            </div>
          </div>

          {/* Student Information */}
          <div className="bg-white rounded-lg border border-sky-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-600" />
              Thông tin học sinh
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Tên học sinh
                </label>
                <p className="text-gray-900 font-medium">
                  {delivery.student?.name || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Lớp học
                </label>
                <p className="text-gray-900">
                  {delivery.student?.class?.name || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="bg-white rounded-lg border border-sky-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              Thông tin phụ huynh
            </h3>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Người gửi
              </label>
              <p className="text-gray-900 font-medium">
                {delivery.parentName || "N/A"}
              </p>
            </div>
          </div>

          {/* Medicine Information */}
          <div className="bg-white rounded-lg border border-sky-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4 text-sky-600" />
              Thông tin thuốc
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Tên đơn thuốc
                </label>
                <p className="text-gray-900 font-medium">{delivery.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Thành phần thuốc
                </label>
                <p className="text-gray-900 bg-sky-50 p-3 rounded-lg border border-sky-100">
                  {delivery.note || "Không có thông tin thành phần"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Tổng số liều
                  </label>
                  <p className="text-gray-900">{delivery.total} liều</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Số lần uống/ngày
                </label>
                <p className="text-gray-900">{delivery.per_day}</p>
              </div>
            </div>
          </div>

          {/* Usage Information */}
          {delivery.reason && (
            <div className="bg-white rounded-lg border border-sky-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                Lý do sử dụng
              </h3>
              <div>
                <p className="text-gray-900 bg-sky-50 p-3 rounded-lg border border-sky-100">
                  {delivery.reason}
                </p>
              </div>
            </div>
          )}

          {/* Timeline Information */}
          <div className="bg-white rounded-lg border border-sky-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              Thời gian phụ huynh tạo
            </h3>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Thời gian gửi yêu cầu
              </label>
              <p className="text-gray-900">
                {delivery.created_at
                  ? new Date(delivery.created_at).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-sky-100 pt-4">
          <Button
            onClick={onClose}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

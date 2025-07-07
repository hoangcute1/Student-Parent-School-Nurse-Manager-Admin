import React from "react";
import type { MedicineDeliveryByParent } from "@/lib/type/medicine-delivery";

interface ViewDeliveryDialogProps {
  delivery: MedicineDeliveryByParent;
  medications: any[];
  onClose: () => void;
}

const ViewDeliveryDialog: React.FC<ViewDeliveryDialogProps> = ({
  delivery,
  medications,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative border border-sky-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-white">
          <button
            className="absolute top-4 right-4 text-white hover:text-sky-200 transition-colors text-2xl font-bold z-10"
            onClick={onClose}
            aria-label="Đóng"
          >
            ×
          </button>
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
              💊
            </div>
            Chi tiết đơn thuốc
          </h3>
        </div>

        {/* Content */}
        <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50">
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-sky-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-sky-600">
                    Học sinh
                  </span>
                  <p className="text-sky-900 font-semibold bg-sky-50 px-3 py-2 rounded-lg">
                    {delivery.student?.name || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-sky-600">
                    Tên đơn thuốc
                  </span>
                  <p className="text-sky-900 font-semibold bg-sky-50 px-3 py-2 rounded-lg">
                    {delivery.name || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-sky-600">
                    Thành phần thuốc
                  </span>
                  <p className="text-sky-900 bg-sky-50 px-3 py-2 rounded-lg">
                    {delivery.note || "Không có thông tin thành phần"}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-sky-600">
                    Liều lượng
                  </span>
                  <p className="text-sky-900 font-semibold bg-sky-50 px-3 py-2 rounded-lg">
                    {delivery.per_dose}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-sky-600">
                    Số lần/ngày
                  </span>
                  <p className="text-sky-900 font-semibold bg-sky-50 px-3 py-2 rounded-lg">
                    {delivery.per_day} lần
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-sky-600">
                    Người nhận
                  </span>
                  <p className="text-sky-900 font-semibold bg-sky-50 px-3 py-2 rounded-lg">
                    {delivery.staffName || "Chưa có"}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-sky-600">
                    Trạng thái
                  </span>
                  <div className="flex">
                    <span
                      className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                        delivery.status === "completed"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : delivery.status === "cancelled"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : delivery.status === "progress"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      {delivery.status === "pending"
                        ? "🕐 Chờ xử lý"
                        : delivery.status === "progress"
                        ? "⚡ Đang làm"
                        : delivery.status === "completed"
                        ? "✅ Đã hoàn thành"
                        : delivery.status === "cancelled"
                        ? "❌ Đã huỷ"
                        : delivery.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-sky-600">
                    Thời gian tạo đơn
                  </span>
                  <p className="text-sky-900 font-semibold bg-sky-50 px-3 py-2 rounded-lg">
                    {delivery.created_at
                      ? new Date(delivery.created_at).toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "Chưa có thông tin"}
                  </p>
                </div>
              </div>
            </div>

            {(delivery.note || delivery.reason) && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-sky-200">
                {delivery.reason && (
                  <div className="space-y-2 mb-4">
                    <span className="text-sm font-medium text-sky-600">
                      Lý do sử dụng
                    </span>
                    <p className="text-sky-900 bg-sky-50 px-3 py-2 rounded-lg">
                      {delivery.reason}
                    </p>
                  </div>
                )}
                {delivery.note && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-sky-600">
                      Ghi chú thêm từ phụ huynh
                    </span>
                    <p className="text-sky-900 bg-sky-50 px-3 py-2 rounded-lg">
                      {delivery.note}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDeliveryDialog;

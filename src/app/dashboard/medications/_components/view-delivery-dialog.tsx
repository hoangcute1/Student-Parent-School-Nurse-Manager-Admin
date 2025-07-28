import React, { useMemo } from "react";
import type { MedicineDeliveryByParent } from "@/lib/type/medicine-delivery";

interface ViewDeliveryDialogProps {
  delivery: MedicineDeliveryByParent;
  onClose: () => void;
}

const InfoRow = React.memo(function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-sky-600">{label}</span>
      <p className="text-sky-900 font-semibold bg-sky-50 px-3 py-2 rounded-lg">{value}</p>
    </div>
  );
});

const StatusBadge = React.memo(function StatusBadge({ status }: { status: string }) {
  const { text, className } = useMemo(() => {
    switch (status) {
      case "pending":
        return { text: "🕐 Chờ xử lý", className: "bg-white text-gray-800 border border-gray-200" };
      case "morning":
        return { text: "⚡ Đã uống buổi sáng", className: "bg-yellow-100 text-yellow-800 border border-yellow-200" };
      case "noon":
        return { text: "⚡ Đã uống buổi trưa", className: "bg-yellow-100 text-yellow-800 border border-yellow-200" };
      case "completed":
        return { text: "✅ Đã hoàn thành", className: "bg-green-100 text-green-800 border border-green-200" };
      case "cancelled":
        return { text: "❌ Đã huỷ", className: "bg-red-100 text-red-800 border border-red-200" };
      default:
        return { text: status, className: "bg-white text-gray-800 border border-gray-200" };
    }
  }, [status]);
  return <span className={`px-3 py-2 rounded-lg text-sm font-semibold ${className}`}>{text}</span>;
});

const ViewDeliveryDialog: React.FC<ViewDeliveryDialogProps> = React.memo(({ delivery, onClose }) => {
  const createdAt = useMemo(() =>
    delivery.created_at
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
      : "Chưa có thông tin",
    [delivery.created_at]
  );

  const updatedAt = useMemo(() =>
    delivery.updated_at
      ? new Date(delivery.updated_at).toLocaleDateString(
        "vi-VN",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      )
      : "Chưa có thông tin",
    [delivery.updated_at]
  );

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
                <InfoRow label="Học sinh" value={delivery.student?.name || "N/A"} />
                <InfoRow label="Tên đơn thuốc" value={delivery.name || "N/A"} />
                <InfoRow label="Thành phần thuốc" value={delivery.note || "Không có thông tin thành phần"} />
                <InfoRow label="Thời gian dùng" value={delivery.per_day} />
                {/* <InfoRow label="Người nhận" value={delivery.staffName || "Chưa có"} /> */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-sky-600">Trạng thái</span>
                  <div className="flex">
                    <StatusBadge status={delivery.status} />
                  </div>
                </div>
                <br />
                <InfoRow label="Thời gian tạo đơn" value={createdAt} />
                <InfoRow label="Thời gian cập nhật" value={updatedAt} />
              </div>
            </div>

            {(delivery.note || (delivery.status === "cancelled" && delivery.reason)) && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-sky-200">
                {delivery.status === "cancelled" && delivery.reason && (
                  <div className="space-y-2 mb-4">
                    <span className="text-sm font-medium text-sky-600">
                      Lý do từ chối
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
});

export default ViewDeliveryDialog;

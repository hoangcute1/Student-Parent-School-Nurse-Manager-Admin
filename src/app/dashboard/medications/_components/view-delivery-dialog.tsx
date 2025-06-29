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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-2xl p-10 min-w-[420px] max-w-xl relative border border-blue-200">
        <button
          className="absolute top-3 right-3 text-blue-400 hover:text-blue-700 transition-colors text-lg font-bold"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>
        <h3 className="text-2xl font-semibold mb-6 text-blue-800 text-center ">
          Chi tiết đơn thuốc
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-blue-700">Học sinh:</span>{" "}
            <span>{delivery.student?.name || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-blue-700">Thuốc:</span>{" "}
            <span>
              {typeof delivery.medicine === "object" &&
              delivery.medicine !== null &&
              "name" in delivery.medicine
                ? delivery.medicine.name
                : medications.find((m) => m._id === delivery.medicine._id)
                    ?.name ||
                  delivery.medicine ||
                  "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-blue-700">Liều lượng:</span>{" "}
            <span>{delivery.per_dose}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-blue-700">Người nhận:</span>{" "}
            <span>{delivery.staffName}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-blue-700">Số lần/ngày:</span>{" "}
            <span>{delivery.per_day}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-blue-700">Trạng thái:</span>{" "}
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                delivery.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : delivery.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {delivery.status}
            </span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-blue-700">
              Cập nhật lần cuối:
            </span>{" "}
            <span>
              {delivery.updated_at
                ? new Date(delivery.updated_at).toLocaleDateString("vi-VN")
                : "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-blue-700">Ghi chú:</span>{" "}
            <span>
              {delivery.note || (
                <span className="italic text-gray-400">Không có</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDeliveryDialog;

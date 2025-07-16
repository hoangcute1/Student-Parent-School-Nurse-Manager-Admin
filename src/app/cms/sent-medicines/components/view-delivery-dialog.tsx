import React, { useMemo } from "react";
import type { MedicineDeliveryByStaff } from "@/lib/type/medicine-delivery";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, User, Pill, Clock, X, CheckCircle, Activity, AlertCircle, PillBottle } from "lucide-react";

interface ViewDeliveryDialogProps {
    delivery: MedicineDeliveryByStaff;
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
                return { text: "⚡ Đã uống buổi sáng", className: "bg-yellow-100 text-yellow-800 border-yellow-200" };
            case "noon":
                return { text: "⚡ Đã uống buổi trưa", className: "bg-yellow-100 text-yellow-800 border-yellow-200" };
            case "completed":
                return { text: "✅ Đã hoàn thành", className: "bg-green-100 text-green-800 border-green-200" };
            case "cancelled":
                return { text: "❌ Đã huỷ", className: "bg-red-100 text-red-800 border-red-200" };
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
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-white rounded-xl shadow-2xl border border-sky-200 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b border-sky-100 pb-4">
                    <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                            <Pill className="w-5 h-5 text-sky-600" />
                        </div>
                        Chi tiết đơn thuốc
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {/* Khối thông tin học sinh nổi bật - style giống health-record-dialog */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl mb-4">
                        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                            <div className="h-6 w-6 bg-green-500 rounded-lg flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-green-800 font-bold text-lg">Thông tin học sinh</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-4">
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-green-600">Học sinh</span>
                                <p className="text-green-900 font-medium bg-white px-3 py-2 rounded-lg border border-green-200">{delivery.student?.name || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-green-600">Lớp</span>
                                <p className="text-green-900 font-medium bg-white px-3 py-2 rounded-lg border border-green-200">
                                    {delivery.student?.class?.name || "N/A"}
                                </p>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <span className="text-sm font-medium text-green-600">Phụ huynh</span>
                                <p className="text-green-900 font-medium bg-white px-3 py-2 rounded-lg border border-green-200">{delivery.parentName || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl mb-4">
                        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                            <div className="h-6 w-6 bg-blue-500 rounded-lg flex items-center justify-center">
                                <PillBottle className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-blue-800 font-bold text-lg">Thông tin đơn thuốc</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-4">
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-blue-600">Tên thuốc</span>
                                <p className="text-blue-900 font-medium bg-white px-3 py-2 rounded-lg border border-blue-200">{delivery.name || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-blue-600">Số liều</span>
                                <p className="text-blue-900 font-medium bg-white px-3 py-2 rounded-lg border border-blue-200">
                                    {delivery.total || 0}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-blue-600">Thời gian dùng</span>
                                <p className="text-blue-900 font-medium bg-white px-3 py-2 rounded-lg border border-blue-200">
                                    {delivery.per_day || "N/A"}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-blue-600">Lưu ý cho y tá</span>
                                <p className="text-blue-900 font-medium bg-white px-3 py-2 rounded-lg border border-blue-200">
                                    {delivery.note || "N/A"}
                                </p>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <span className="text-sm font-medium text-yellow-700">Tình trạng</span>
                                <p className="text-yellow-900 font-semibold bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                                    {delivery.status || "N/A"}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-blue-600">Thời gian gửi:</span>
                                <p className="text-blue-900 font-medium bg-white px-3 py-2 rounded-lg border border-blue-200">
                                    {delivery.sent_at ? new Date(delivery.sent_at).toLocaleDateString(
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
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-blue-600">Cập nhật lần cuối:</span>
                                <p className="text-blue-900 font-medium bg-white px-3 py-2 rounded-lg border border-blue-200">
                                    {delivery.updated_at ? new Date(delivery.updated_at).toLocaleDateString(
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
                    {delivery.status === "cancelled" && delivery.reason && (
                        <div className="bg-white rounded-lg border border-red-200 p-4">
                            <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-red-600" />
                                Lý do từ chối
                            </h3>
                            <div>
                                <p className="text-gray-900 bg-red-50 p-3 rounded-lg border border-red-100">
                                    {delivery.reason}
                                </p>
                            </div>
                        </div>
                    )}
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
});

export default ViewDeliveryDialog; 
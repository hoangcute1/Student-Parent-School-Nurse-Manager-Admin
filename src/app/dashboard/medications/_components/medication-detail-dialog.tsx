import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MedicineDelivery, MedicineDeliveryByParent } from "@/lib/type/medicine-delivery";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface MedicationDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    medication: MedicineDeliveryByParent | null;
}

export function MedicationDetailDialog({
    open,
    onOpenChange,
    medication,
}: MedicationDetailDialogProps) {
    // Thêm log để kiểm tra dữ liệu
    console.log("Dialog Medication Data:", medication);

    if (!open) return null;

    const formatDate = (dateInput: string | Date) => {
        try {
            const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
            return format(date, 'dd/MM/yyyy HH:mm');
        } catch (error) {
            return dateInput.toString();
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: { [key: string]: "default" | "secondary" | "destructive" } = {
            pending: "secondary",
            completed: "default",
            cancelled: "destructive",
        };
        const labels: { [key: string]: string } = {
            pending: "Chờ duyệt",
            completed: "Hoàn thành",
            cancelled: "Đã hủy",
        };
        return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-800">Chi tiết đơn thuốc</DialogTitle>
                </DialogHeader>
                {!medication ? (
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[300px]" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Thông tin cơ bản */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg text-blue-800">Thông tin chung</h3>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-gray-500">Tên học sinh:</span>
                                                <p className="font-medium">{medication.student?.name}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Lớp:</span>
                                                <p className="font-medium">{medication.student?.class?.name}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Tên thuốc:</span>
                                                <p className="font-medium">{medication.medicine?.name}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Trạng thái:</span>
                                                <div className="mt-1">{getStatusBadge(medication.status)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thông tin liều lượng */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg text-blue-800">Chi tiết sử dụng</h3>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-gray-500">Liều lượng mỗi lần:</span>
                                                <p className="font-medium">{medication.per_dose}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Số lần uống mỗi ngày:</span>
                                                <p className="font-medium">{medication.per_day} lần/ngày</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Tổng số liều:</span>
                                                <p className="font-medium">{medication.total} liều</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Thời gian và ghi chú */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg text-blue-800">Thời gian</h3>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-gray-500">Ngày bắt đầu:</span>
                                                <p className="font-medium">{formatDate(medication.date)}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Ngày kết thúc:</span>
                                                <p className="font-medium">
                                                    {medication.end_at ? formatDate(medication.end_at) : 'Chưa xác định'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg text-blue-800">Thông tin bổ sung</h3>
                                        <div className="space-y-2">
                                            {medication.reason && (
                                                <div>
                                                    <span className="text-gray-500">Lý do:</span>
                                                    <p className="font-medium">{medication.reason}</p>
                                                </div>
                                            )}
                                            {medication.note && (
                                                <div>
                                                    <span className="text-gray-500">Ghi chú:</span>
                                                    <p className="font-medium">{medication.note}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Thông tin người tạo và cập nhật */}
                                <div className="grid grid-cols-2 gap-6">
                                    
                                    <div className="space-y-2">
                                        <span className="text-gray-500">Nhân viên phê duyệt:</span>
                                        <p className="font-medium">{medication.staffName || 'Chưa phê duyệt'}</p>
                                        <span className="text-gray-500 block mt-2">Cập nhật lần cuối:</span>
                                        <p className="font-medium">{formatDate(medication.updated_at)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

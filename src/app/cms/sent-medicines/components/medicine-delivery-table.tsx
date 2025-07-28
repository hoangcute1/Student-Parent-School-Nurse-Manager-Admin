import React from "react";
import {
  Eye,
  CheckCircle,
  X,
  Clock,
  Activity,
  AlertCircle,
  MoreHorizontal,
  Trash2,
  Check,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MedicineDelivery } from "@/lib/type/medicine-delivery";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface MedicineDeliveryTableProps {
  deliveries: MedicineDelivery[];
  onViewDelivery: (delivery: MedicineDelivery) => void;
  onUpdateStatus: (
    id: string,
    status: "pending" | "morning" | "noon" | "completed" | "cancelled",
    reason?: string
  ) => void;
  onDeleteDelivery?: (delivery: MedicineDelivery) => void;
  isLoading?: boolean;
}

export function MedicineDeliveryTable({
  deliveries,
  onViewDelivery,
  onUpdateStatus,
  onDeleteDelivery,
  isLoading = false,
}: MedicineDeliveryTableProps) {
  // State cho dialog từ chối
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const [rejectId, setRejectId] = React.useState<string | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");

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
      case "morning":
        return "Đã uống buổi sáng";
      case "noon":
        return "Đã uống buổi trưa";
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


  if (isLoading) {
    return (
      <div className="rounded-md border border-sky-200 bg-white">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto"></div>
            <p className="text-gray-500">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (deliveries.length === 0) {
    return (
      <div className="rounded-md border border-sky-200 bg-white">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">Không có đơn thuốc nào</p>
            <p className="text-sm text-gray-400">
              Các nút duyệt đơn sẽ hiển thị khi có dữ liệu với trạng thái tương
              ứng
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-sky-200 bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-sky-50/50">
            <TableHead className="font-semibold text-gray-900">
              Học sinh
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Tên thuốc
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Thời gian dùng
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Trạng thái
            </TableHead>
            <TableHead className="font-semibold text-gray-900 text-right">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.map((delivery) => {
            // Kiểm tra per_day có Sáng, Trưa không
            const hasMorning = delivery.per_day?.includes("Sáng");
            const hasNoon = delivery.per_day?.includes("Trưa");
            return (
              <TableRow
                key={delivery.id}
                className="hover:bg-sky-50/30 transition-colors"
              >
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">
                      {delivery.student?.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      Lớp: {delivery.student?.class?.name || "N/A"} <br />
                      Phụ huynh: {delivery.parentName || "N/A"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">
                      {delivery.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Số liều: {delivery.total || 0}  <br />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">
                      {delivery.per_day}
                    </div>
                    <div className="text-sm text-gray-500">
                      Lưu ý cho y tá: {delivery.note || "Không có"} <br />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(
                      delivery.status
                    )} flex items-center gap-1 w-fit`}
                  >
                    {getStatusIcon(delivery.status)}
                    {getStatusText(delivery.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Nút hành động tuỳ theo per_day và status */}
                    {delivery.status === "pending" && (
                      <>
                        {hasMorning && hasNoon ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onUpdateStatus(delivery.id, "morning")}
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Xong buổi sáng</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onUpdateStatus(delivery.id, "completed")}
                                  className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Hoàn thành</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setRejectId(delivery.id);
                                  setRejectOpen(true);
                                  setRejectReason("");
                                }}
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Từ chối</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                    {(delivery.status === "morning" && hasMorning && hasNoon) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onUpdateStatus(delivery.id, "completed")}
                              className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                            >
                              Hoàn thành
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Hoàn thành</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {/* More actions dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {onViewDelivery && (
                          <DropdownMenuItem
                            onClick={() => onViewDelivery(delivery)}
                            className="text-blue-600 hover:bg-orange-50 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="ml-2">Xem chi tiết</span>
                          </DropdownMenuItem>
                        )}
                        {/* Soft delete action - only show if function is provided */}
                        {onDeleteDelivery && (
                          <DropdownMenuItem
                            onClick={() => onDeleteDelivery(delivery)}
                            className="text-orange-600 hover:bg-orange-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="ml-2">Ẩn đơn</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {/* Dialog nhập lý do từ chối */}
      <Dialog open={rejectOpen} onOpenChange={(open) => {
        setRejectOpen(open);
        if (!open) {
          setRejectReason("");
          setRejectId(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nhập lý do từ chối</DialogTitle>
          </DialogHeader>
          <Input
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="Nhập lý do từ chối..."
            className="mt-2"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectOpen(false);
                setRejectReason("");
                setRejectId(null);
              }}
            >
              Huỷ
            </Button>
            <Button
              disabled={!rejectReason.trim()}
              onClick={() => {
                if (rejectId) {
                  onUpdateStatus(rejectId, "cancelled", rejectReason);
                  setRejectOpen(false);
                  setRejectReason("");
                  setRejectId(null);
                }
              }}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

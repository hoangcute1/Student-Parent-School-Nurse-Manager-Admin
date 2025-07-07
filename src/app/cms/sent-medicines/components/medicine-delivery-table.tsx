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
import type { MedicineDeliveryByStaff } from "@/lib/type/medicine-delivery";

interface MedicineDeliveryTableProps {
  deliveries: MedicineDeliveryByStaff[];
  onViewDelivery: (delivery: MedicineDeliveryByStaff) => void;
  onUpdateStatus: (
    id: string,
    status: "pending" | "progress" | "completed" | "cancelled"
  ) => void;
  onDeleteDelivery?: (delivery: MedicineDeliveryByStaff) => void;
  isLoading?: boolean;
}

export function MedicineDeliveryTable({
  deliveries,
  onViewDelivery,
  onUpdateStatus,
  onDeleteDelivery,
  isLoading = false,
}: MedicineDeliveryTableProps) {
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
      case "progress":
        return <Activity className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getAvailableActions = (status: string) => {
    switch (status) {
      case "pending":
        return [
          {
            label: "Phê duyệt",
            action: "progress",
            icon: <CheckCircle className="w-4 h-4" />,
            color: "text-blue-600",
          },
          {
            label: "Từ chối",
            action: "cancelled",
            icon: <X className="w-4 h-4" />,
            color: "text-red-600",
          },
        ];
      case "progress":
        return [
          {
            label: "Hoàn thành",
            action: "completed",
            icon: <CheckCircle className="w-4 h-4" />,
            color: "text-green-600",
          },
          {
            label: "Hủy bỏ",
            action: "cancelled",
            icon: <X className="w-4 h-4" />,
            color: "text-red-600",
          },
        ];
      default:
        return [];
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
              Thành phần thuốc
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Phụ huynh
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Trạng thái
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Ngày tạo
            </TableHead>
            <TableHead className="font-semibold text-gray-900 text-right">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.map((delivery) => (
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
                    Lớp: {delivery.student?.class?.name || "N/A"}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-gray-900">
                    {delivery.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {delivery.note || "Không có thông tin thành phần"}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-gray-900">
                  {delivery.parentName || "N/A"}
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
              <TableCell>
                <div className="text-gray-900">
                  {delivery.created_at
                    ? new Date(delivery.created_at).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "N/A"}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* Quick action buttons for pending status */}
                  {delivery.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateStatus(delivery.id, "progress")}
                        className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Duyệt
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateStatus(delivery.id, "cancelled")}
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Từ chối
                      </Button>
                    </>
                  )}

                  {/* Quick complete button for progress status */}
                  {delivery.status === "progress" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateStatus(delivery.id, "completed")}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Hoàn thành
                    </Button>
                  )}

                  {/* View button - always visible */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDelivery(delivery)}
                    className="text-sky-600 hover:text-sky-800 hover:bg-sky-50"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

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
                      {/* Status change actions */}
                      {getAvailableActions(delivery.status).map((action) => (
                        <DropdownMenuItem
                          key={action.action}
                          onClick={() =>
                            onUpdateStatus(delivery.id, action.action as any)
                          }
                          className={`${action.color} hover:bg-gray-50 cursor-pointer`}
                        >
                          {action.icon}
                          <span className="ml-2">{action.label}</span>
                        </DropdownMenuItem>
                      ))}

                      {/* Separator if there are both status actions and delete */}
                      {getAvailableActions(delivery.status).length > 0 &&
                        onDeleteDelivery && (
                          <div className="border-t border-gray-100 my-1" />
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  User,
  FileText,
  Phone,
  AlertCircle,
  Eye,
  RefreshCw,
  Bell,
  CheckCircle,
  Clock,
} from "lucide-react";
import { TreatmentHistory } from "@/lib/type/treatment-history";
import {
  useParentId,
  useIsParent,
  getParentId,
} from "@/lib/utils/parent-utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTreatmentHistoryStore } from "@/stores/treatment-history-store";
import { useTreatmentHistorySync } from "@/hooks/use-treatment-history-sync";
import { TreatmentHistoryUpdateNotifier } from "@/components/treatment-history-update-notifier";
import { getNotificationsByParentId } from "@/lib/api/notification";
import { useParentStudentsStore } from "@/stores/parent-students-store";

// Thêm type cho prop
interface ConsultationComponentProps {
  onMarkAsRead?: () => Promise<void>;
}

export default function ConsultationComponent({ onMarkAsRead }: ConsultationComponentProps) {
  const [selectedEvent, setSelectedEvent] = useState<TreatmentHistory | null>(
    null
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { manualRefresh } = useTreatmentHistorySync();
  const { fetchStudentsByParent } = useParentStudentsStore();
  const [notificationLoading, setNotificationLoading] = useState(false); // Thêm state loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parentId = await getParentId();
        const notificationData = await getNotificationsByParentId(parentId);
        setNotifications(notificationData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchStudentsByParent]);

  // Manual refresh function
  const handleManualRefresh = useCallback(async () => {
    console.log("🔄 Manual refresh triggered");
    await manualRefresh();
  }, [manualRefresh]);

  // Hàm đánh dấu đã đọc
  const handleMarkAsRead = async (notificationId: string) => {
    setNotificationLoading(true);
    try {
      // TODO: Gọi API đánh dấu đã đọc ở đây
      setNotifications((prev) =>
        prev.map((n: any) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      // Gọi callback nếu có
      if (onMarkAsRead) await onMarkAsRead();
    } catch (error) {
      // Xử lý lỗi nếu cần
    } finally {
      setNotificationLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Cao":
        return "bg-red-100 text-red-800 border-red-200";
      case "Trung bình":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Thấp":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStudentName = (student: any) => {
    if (typeof student === "string") return student;
    if (typeof student === "object" && student?.name) return student.name;
    return "N/A";
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-orange-100 text-orange-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "resolved":
        return "Đã xử lý";
      case "processing":
        return "Đang xử lý";
      case "pending":
        return "Chờ xử lý";
      default:
        return "Mới";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Ngày không hợp lệ";

      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Lỗi định dạng ngày";
    }
  };

  const handleViewDetails = (event: TreatmentHistory) => {
    setSelectedEvent(event);
    setDetailsOpen(true);
  };

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch sử bệnh án...</p>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có lịch sử bệnh án
          </h3>
          <p className="text-gray-600">
            Hiện tại chưa có sự cố y tế nào được ghi nhận cho con em bạn.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Update notification */}
      <TreatmentHistoryUpdateNotifier onRefresh={handleManualRefresh} />

      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không có thông báo nào
        </div>
      ) : (
        <div className="space-y-4">
          {notifications
            .filter(
              (notification: any) =>
                notification.type === "CONSULTATION_APPOINTMENT"
            )
            .map((notification: any) => (
              <div
                key={notification._id}
                className={`shadow-lg rounded-xl p-6 mb-2 transition-shadow duration-300 border-none bg-white hover:shadow-2xl ${
                  !notification.isRead
                    ? "ring-2 ring-blue-200"
                    : "ring-1 ring-gray-200"
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-lg text-blue-800 truncate">
                        {notification.content}
                      </h4>
                      <Badge className="ml-2 bg-blue-100 text-blue-700 border border-blue-200">
                        Lịch hẹn tư vấn
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        <span className="truncate">
                          <span className="font-medium">Học sinh:</span>{" "}
                          {getStudentName(notification.student)}
                        </span>
                      </div>
                      {notification.consultation_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>
                            <span className="font-medium">Ngày hẹn:</span>{" "}
                            {new Date(
                              notification.consultation_date
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      )}
                      {notification.consultation_time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>
                            <span className="font-medium">Giờ hẹn:</span>{" "}
                            {notification.consultation_time}
                          </span>
                        </div>
                      )}
                      {notification.consultation_doctor && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-500" />
                          <span>
                            <span className="font-medium">Bác sĩ:</span>{" "}
                            {notification.consultation_doctor}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <span className="text-xs text-gray-400">
                      Tạo lúc: {formatDate(notification.createdAt || "")}
                    </span>
                    {notification.updatedAt && (
                      <span className="text-xs text-gray-400">
                        Cập nhật: {formatDate(notification.updatedAt)}
                      </span>
                    )}
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsRead(notification._id)}
                        disabled={notificationLoading}
                        className="bg-blue-600 hover:bg-blue-700 mt-2"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Đánh dấu đã đọc
                      </Button>
                    )}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg mt-2 border-l-4 border-blue-400">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">
                      Ghi chú tư vấn:
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {notification.notes || "Không có ghi chú."}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-800">
              Chi tiết sự cố y tế
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về sự cố y tế của con em bạn
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Tiêu đề
                  </label>
                  <p className="text-gray-900">{selectedEvent.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Học sinh
                  </label>
                  <p className="text-gray-900">
                    {typeof selectedEvent.student === "object"
                      ? `${selectedEvent.student.name} (${selectedEvent.student.studentId})`
                      : selectedEvent.student}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Lớp
                  </label>
                  <p className="text-gray-900">{selectedEvent.class}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Địa điểm
                  </label>
                  <p className="text-gray-900">{selectedEvent.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Mức độ ưu tiên
                  </label>
                  <Badge
                    className={getPriorityColor(
                      selectedEvent.priority || "Thấp"
                    )}
                  >
                    {selectedEvent.priority || "Thấp"}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Trạng thái xử lý
                  </label>
                  <Badge className={getStatusColor(selectedEvent.status)}>
                    {getStatusText(selectedEvent.status)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Trạng thái liên hệ
                  </label>
                  <p className="text-gray-900">{selectedEvent.contactStatus}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Thời gian
                  </label>
                  <p className="text-gray-900">
                    {selectedEvent.date
                      ? new Date(selectedEvent.date).toLocaleString("vi-VN")
                      : selectedEvent.createdAt
                      ? new Date(selectedEvent.createdAt).toLocaleString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mô tả chi tiết
                </label>
                <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                  {selectedEvent.description}
                </p>
              </div>

              {selectedEvent.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Ghi chú xử lý
                  </label>
                  <p className="text-gray-900 mt-1 p-3 bg-blue-50 rounded-md whitespace-pre-line">
                    {selectedEvent.notes.includes("|")
                      ? selectedEvent.notes
                          .split("|")
                          .map((line, idx) => (
                            <div key={idx}>{line.trim()}</div>
                          ))
                      : selectedEvent.notes}
                  </p>
                </div>
              )}

              {selectedEvent.actionTaken && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Hành động đã thực hiện
                  </label>
                  <p className="text-gray-900 mt-1 p-3 bg-green-50 rounded-md">
                    {selectedEvent.actionTaken}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

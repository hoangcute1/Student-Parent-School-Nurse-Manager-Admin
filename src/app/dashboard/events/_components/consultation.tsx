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
import {
  getNotificationsByParentId,
  markNotificationAsRead,
} from "@/lib/api/notification";
import { useParentStudentsStore } from "@/stores/parent-students-store";

// Thêm type cho prop
interface ConsultationComponentProps {
  onMarkAsRead?: () => Promise<void>;
}

// Hàm parse notes dạng text
function parseConsultationNotes(notes: string) {
  if (!notes) return {};
  const result: any = {};
  const lines = notes.split(/\r?\n/);
  lines.forEach((line) => {
    if (line.startsWith("Bác sĩ:"))
      result.doctor = line.replace("Bác sĩ:", "").trim();
    else if (line.startsWith("Ngày hẹn:"))
      result.date = line.replace("Ngày hẹn:", "").trim();
    else if (line.startsWith("Giờ hẹn:"))
      result.time = line.replace("Giờ hẹn:", "").trim();
    else if (line.startsWith("Ghi chú:"))
      result.note = line.replace("Ghi chú:", "").trim();
  });
  return result;
}

export default function ConsultationComponent({
  onMarkAsRead,
}: ConsultationComponentProps) {
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
  const [markAsReadError, setMarkAsReadError] = useState<string | null>(null); // Thêm state lỗi

  const fetchNotifications = async () => {
    try {
      const parentId = await getParentId();
      const notificationData = await getNotificationsByParentId(parentId);
      console.log("Fetched notifications:", notificationData);
      setNotifications(notificationData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchStudentsByParent]);

  // Tự động refresh mỗi 30 giây để đảm bảo dữ liệu luôn mới
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleManualRefresh = useCallback(async () => {
    console.log("🔄 Manual refresh triggered");
    await manualRefresh();
  }, [manualRefresh]);

  // Hàm đánh dấu đã đọc
  const handleMarkAsRead = async (notificationId: string) => {
    setNotificationLoading(true);
    setMarkAsReadError(null); // Reset lỗi
    try {
      console.log("Marking notification as read:", notificationId);

      // Gọi API đánh dấu đã đọc
      await markNotificationAsRead(notificationId);
      console.log("Successfully marked notification as read");

      // Refresh lại dữ liệu từ server để đảm bảo đồng bộ
      await fetchNotifications();

      // Gọi callback để cập nhật badge count
      if (onMarkAsRead) {
        console.log("Calling onMarkAsRead callback");
        await onMarkAsRead();
      }

      // Thêm delay nhỏ để đảm bảo UI cập nhật
      setTimeout(() => {
        if (onMarkAsRead) {
          onMarkAsRead();
        }
      }, 1000);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setMarkAsReadError("Không thể đánh dấu đã đọc. Vui lòng thử lại.");
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

      {/* Hiển thị lỗi đánh dấu đã đọc */}
      {markAsReadError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{markAsReadError}</AlertDescription>
        </Alert>
      )}

      {/* Button refresh thủ công */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchNotifications}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không có thông báo nào
        </div>
      ) : (
        <div className="space-y-4">
          {(() => {
            const consultationNotifications = notifications.filter(
              (notification: any) =>
                notification.type === "CONSULTATION_APPOINTMENT"
            );
            console.log("All notifications:", notifications);
            console.log(
              "Consultation notifications:",
              consultationNotifications
            );
            return consultationNotifications.map((notification: any) => {
              // Ưu tiên lấy trường riêng, nếu không có thì parse từ notes
              const parsed = parseConsultationNotes(notification.notes || "");
              const doctor = notification.consultation_doctor || parsed.doctor;
              const date = notification.consultation_date
                ? new Date(notification.consultation_date).toLocaleDateString(
                    "vi-VN"
                  )
                : parsed.date;
              const time = notification.consultation_time || parsed.time;
              const note = parsed.note;
              return (
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
                      {/* Khối thông tin lịch hẹn */}
                      <div className="flex flex-wrap gap-2 items-center bg-blue-50 border border-blue-100 rounded-lg p-3 mb-2">
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-blue-200 bg-white text-sm font-medium text-blue-800">
                          <User className="w-4 h-4 text-blue-500 mr-1" />
                          <span>Học sinh:</span>
                          <span className="font-semibold text-gray-900 ml-1">
                            {getStudentName(notification.student)}
                          </span>
                        </div>
                        {date && (
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-blue-200 bg-white text-sm font-medium text-blue-800">
                            <Calendar className="w-4 h-4 text-blue-500 mr-1" />
                            <span>Ngày hẹn:</span>
                            <span className="font-semibold text-gray-900 ml-1">
                              {date}
                            </span>
                          </div>
                        )}
                        {time && (
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-blue-200 bg-white text-sm font-medium text-blue-800">
                            <Clock className="w-4 h-4 text-blue-500 mr-1" />
                            <span>Giờ hẹn:</span>
                            <span className="font-semibold text-gray-900 ml-1">
                              {time}
                            </span>
                          </div>
                        )}
                        {doctor && (
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-blue-200 bg-white text-sm font-medium text-blue-800">
                            <User className="w-4 h-4 text-blue-500 mr-1" />
                            <span>Bác sĩ:</span>
                            <span className="font-semibold text-gray-900 ml-1">
                              {doctor}
                            </span>
                          </div>
                        )}
                      </div>
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
                      {note || notification.notes || "Không có ghi chú."}
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsRead(notification._id)}
                        disabled={notificationLoading}
                        className="rounded-full bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 shadow-sm flex items-center gap-2"
                        style={{ minWidth: 160 }}
                      >
                        {notificationLoading ? (
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        )}
                        {notificationLoading
                          ? "Đang xử lý..."
                          : "Đánh dấu đã đọc"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            });
          })()}
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

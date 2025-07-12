"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/auth";
import { fetchData } from "@/lib/api/api";
import { useParentStudentsStore } from "@/stores/parent-students-store";

interface HealthExaminationNotification {
  _id: string;
  noti_campaign?: string;
  content?: string;
  notes?: string;
  date?: string;
  confirmation_status?: "Pending" | "Agree" | "Disagree";
  student: {
    _id: string;
    name: string;
    class_name?: string;
    class?: { name?: string };
  };
  // Data từ examination
  examination_date?: string;
  examination_time?: string;
  location?: string;
  doctor_name?: string;
  examination_type?: string;
  title?: string;
  description?: string;
}

export default function HealthExaminationNotifications({
  pendingExaminations: propPendingExaminations,
}: { pendingExaminations?: HealthExaminationNotification[] } = {}) {
  const [notifications, setNotifications] = useState<
    HealthExaminationNotification[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [responseNotes, setResponseNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  // Lấy parentId từ JWT token
  const getParentId = () => {
    try {
      const token = getAuthToken();
      if (!token) return "unknown-parent";
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || "unknown-parent";
    } catch (error) {
      return "unknown-parent";
    }
  };

  const parentId = getParentId();
  // Nếu có props, ưu tiên dùng props, nếu không thì lấy từ store hoặc API như cũ
  const { studentsData, fetchHealthExaminationsPending } =
    useParentStudentsStore();

  useEffect(() => {
    if (propPendingExaminations && propPendingExaminations.length > 0) {
      setNotifications(propPendingExaminations);
      setLoading(false);
      return;
    }
    // Nếu không có props, lấy tất cả lịch khám pending của các học sinh
    const fetchAll = async () => {
      if (!studentsData || studentsData.length === 0) {
        setNotifications([]);
        setLoading(false);
        return;
      }
      const allExams = await Promise.all(
        studentsData.map((student: any) =>
          fetchHealthExaminationsPending(student.student._id).then((res: any) =>
            (res || []).map((item: any) => ({
              ...item,
              student: student.student,
              date: item.examination_date || item.date || "",
            }))
          )
        )
      );
      setNotifications(allExams.flat());
      setLoading(false);
    };
    fetchAll();
  }, [propPendingExaminations, studentsData, fetchHealthExaminationsPending]);

  const handleResponse = async (
    notificationId: string,
    status: "Agree" | "Disagree"
  ) => {
    setResponding(notificationId);

    try {
      const response = await fetchData(
        `/notifications/${notificationId}/respond`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            notes: status === "Agree" ? responseNotes : undefined,
            rejectionReason:
              status === "Disagree" ? rejectionReason : undefined,
          }),
        }
      );

      if (response) {
        toast.success(
          status === "Agree"
            ? "Đã xác nhận tham gia lịch khám"
            : "Đã từ chối lịch khám"
        );

        // Cập nhật state local
        setNotifications((prev) =>
          prev.map((noti) =>
            noti._id === notificationId
              ? { ...noti, confirmation_status: status }
              : noti
          )
        );

        // Reset form
        setResponseNotes("");
        setRejectionReason("");
      } else {
        throw new Error("Failed to respond");
      }
    } catch (error) {
      console.error("Error responding to notification:", error);
      toast.error("Không thể gửi phản hồi");
    } finally {
      setResponding(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Agree":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã đồng ý
          </Badge>
        );
      case "Disagree":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Đã từ chối
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Chờ phản hồi
          </Badge>
        );
    }
  };

  const parseNotesForExaminationDetails = (notes: string) => {
    const lines = notes.split("\\n");
    let description = lines[0] || "";
    let date = "";
    let time = "";

    lines.forEach((line) => {
      if (line.includes("Ngày khám:")) {
        date = line.replace("Ngày khám:", "").trim();
      }
      if (line.includes("Giờ khám:")) {
        time = line.replace("Giờ khám:", "").trim();
      }
    });

    return { description, date, time };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Không có thông báo lịch khám nào</p>
        </CardContent>
      </Card>
    );
  }

  // Phân loại thông báo quan trọng và sự kiện sắp tới
  const importantNotifications = notifications.filter((noti) => {
    const d = noti.examination_date || noti.date;
    if (!d) return false;
    const days = (() => {
      const examDate = new Date(d);
      const today = new Date();
      return Math.ceil(
        (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
    })();
    return days <= 14;
  });
  const upcomingNotifications = notifications.filter((noti) => {
    const d = noti.examination_date || noti.date;
    if (!d) return false;
    const days = (() => {
      const examDate = new Date(d);
      const today = new Date();
      return Math.ceil(
        (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
    })();
    return days > 14;
  });

  return (
    <div className="space-y-8">
      {/* Thông báo quan trọng */}
      <div>
        <h2 className="text-lg font-semibold text-red-700 mb-2">
          Thông báo quan trọng
        </h2>
        {importantNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-gray-500">
              Không có thông báo quan trọng nào
            </CardContent>
          </Card>
        ) : (
          importantNotifications.map((notification) => {
            const { description, date, time } = parseNotesForExaminationDetails(
              notification.notes || ""
            );
            return (
              <Card
                key={notification._id}
                className="border-l-4 border-l-blue-500 mb-4"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                        {/* Cột trái */}
                        <div className="space-y-1">
                          <CardTitle className="text-blue-800 flex items-center gap-2">
                            {notification.content ||
                              notification.title ||
                              "Lịch khám sức khỏe"}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-blue-700 text-sm">
                            <User className="w-4 h-4" />
                            <span>
                              Học sinh: {notification.student?.name || "-"}
                              {notification.student?.class_name &&
                                ` - Lớp ${notification.student.class_name}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-700 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Thời gian:{" "}
                              {notification.examination_date
                                ? new Date(
                                    notification.examination_date
                                  ).toLocaleDateString("vi-VN")
                                : date}
                              {notification.examination_time
                                ? ` lúc ${notification.examination_time}`
                                : time
                                ? ` lúc ${time}`
                                : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-700 text-sm">
                            <User className="w-4 h-4" />
                            <span>
                              Bác sĩ phụ trách:{" "}
                              {notification.doctor_name || "-"}
                            </span>
                          </div>
                          {(notification.description || description) && (
                            <div className="flex items-center gap-2 text-blue-700 text-sm">
                              <span className="font-medium">Ghi chú:</span>{" "}
                              {notification.description || description}
                            </div>
                          )}
                        </div>
                        {/* Cột phải */}
                        <div className="space-y-1 md:text-right">
                          <div className="flex items-center gap-2 text-blue-700 text-sm md:justify-end">
                            <span className="font-medium">Loại khám:</span>{" "}
                            {notification.examination_type || "-"}
                          </div>
                          <div className="flex items-center gap-2 text-blue-700 text-sm md:justify-end">
                            <MapPin className="w-4 h-4" />
                            <span>
                              Địa điểm: {notification.location || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {(() => {
                            const d =
                              notification.examination_date ||
                              notification.date;
                            if (!d) return "-";
                            const days = (() => {
                              const examDate = new Date(d);
                              const today = new Date();
                              return Math.ceil(
                                (examDate.getTime() - today.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              );
                            })();
                            return days > 0
                              ? `Còn ${days} ngày nữa`
                              : days === 0
                              ? "Hôm nay"
                              : `Quá hạn ${Math.abs(days)} ngày`;
                          })()}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs text-blue-800 border-blue-200 bg-blue-50"
                        >
                          Chờ xác nhận khám
                        </Badge>
                      </div>
                    </div>
                    {getStatusBadge(
                      notification.confirmation_status || "Pending"
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Luôn hiển thị nút Đồng ý và Không đồng ý nếu trạng thái Pending */}
                  {(!notification.confirmation_status ||
                    notification.confirmation_status === "Pending") && (
                    <div className="flex gap-2 pt-4 border-t">
                      {/* Nút Đồng ý: xác nhận ngay, không mở dialog */}
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          handleResponse(notification._id, "Agree")
                        }
                        disabled={responding === notification._id}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Đồng ý
                      </Button>
                      {/* Nút Từ chối: xác nhận ngay, không mở dialog */}
                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleResponse(notification._id, "Disagree")
                        }
                        disabled={responding === notification._id}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Từ chối
                      </Button>
                    </div>
                  )}
                  {/* Chỉ hiển thị khi đã phản hồi */}
                  {notification.confirmation_status &&
                    notification.confirmation_status !== "Pending" && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          Đã phản hồi vào{" "}
                          {new Date(
                            notification.date ||
                              notification.examination_date ||
                              ""
                          ).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
      {/* Sự kiện sắp tới */}
      <div>
        <h2 className="text-lg font-semibold text-blue-700 mb-2">
          Sự kiện sắp tới
        </h2>
        {upcomingNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-gray-500">
              Không có sự kiện sắp tới
            </CardContent>
          </Card>
        ) : (
          upcomingNotifications.map((notification) => {
            const { description, date, time } = parseNotesForExaminationDetails(
              notification.notes || ""
            );
            return (
              <Card
                key={notification._id}
                className="border-l-4 border-l-blue-500 mb-4"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                        {/* Cột trái */}
                        <div className="space-y-1">
                          <CardTitle className="text-blue-800 flex items-center gap-2">
                            {notification.content ||
                              notification.title ||
                              "Lịch khám sức khỏe"}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-blue-700 text-sm">
                            <User className="w-4 h-4" />
                            <span>
                              Học sinh: {notification.student?.name || "-"}
                              {notification.student?.class_name &&
                                ` - Lớp ${notification.student.class_name}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-700 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Thời gian:{" "}
                              {notification.examination_date
                                ? new Date(
                                    notification.examination_date
                                  ).toLocaleDateString("vi-VN")
                                : date}
                              {notification.examination_time
                                ? ` lúc ${notification.examination_time}`
                                : time
                                ? ` lúc ${time}`
                                : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-700 text-sm">
                            <User className="w-4 h-4" />
                            <span>
                              Bác sĩ phụ trách:{" "}
                              {notification.doctor_name || "-"}
                            </span>
                          </div>
                          {(notification.description || description) && (
                            <div className="flex items-center gap-2 text-blue-700 text-sm">
                              <span className="font-medium">Ghi chú:</span>{" "}
                              {notification.description || description}
                            </div>
                          )}
                        </div>
                        {/* Cột phải */}
                        <div className="space-y-1 md:text-right">
                          <div className="flex items-center gap-2 text-blue-700 text-sm md:justify-end">
                            <span className="font-medium">Loại khám:</span>{" "}
                            {notification.examination_type || "-"}
                          </div>
                          <div className="flex items-center gap-2 text-blue-700 text-sm md:justify-end">
                            <MapPin className="w-4 h-4" />
                            <span>
                              Địa điểm: {notification.location || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {(() => {
                            const d =
                              notification.examination_date ||
                              notification.date;
                            if (!d) return "-";
                            const days = (() => {
                              const examDate = new Date(d);
                              const today = new Date();
                              return Math.ceil(
                                (examDate.getTime() - today.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              );
                            })();
                            return days > 0
                              ? `Còn ${days} ngày nữa`
                              : days === 0
                              ? "Hôm nay"
                              : `Quá hạn ${Math.abs(days)} ngày`;
                          })()}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs text-blue-800 border-blue-200 bg-blue-50"
                        >
                          Chờ xác nhận khám
                        </Badge>
                      </div>
                    </div>
                    {getStatusBadge(
                      notification.confirmation_status || "Pending"
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Luôn hiển thị nút Đồng ý và Không đồng ý nếu trạng thái Pending */}
                  {(!notification.confirmation_status ||
                    notification.confirmation_status === "Pending") && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Đồng ý
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Xác nhận tham gia lịch khám
                            </DialogTitle>
                            <DialogDescription>
                              Bạn có muốn cho con tham gia lịch khám này không?
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Ghi chú (tùy chọn)..."
                              value={responseNotes}
                              onChange={(e) => setResponseNotes(e.target.value)}
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={() =>
                                handleResponse(notification._id, "Agree")
                              }
                              disabled={responding === notification._id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {responding === notification._id
                                ? "Đang xử lý..."
                                : "Xác nhận đồng ý"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive">
                            <XCircle className="w-4 h-4 mr-2" />
                            Từ chối
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Từ chối lịch khám</DialogTitle>
                            <DialogDescription>
                              Vui lòng cho biết lý do từ chối để chúng tôi có
                              thể hỗ trợ tốt hơn.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Lý do từ chối..."
                              value={rejectionReason}
                              onChange={(e) =>
                                setRejectionReason(e.target.value)
                              }
                              required
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                handleResponse(notification._id, "Disagree")
                              }
                              disabled={
                                responding === notification._id ||
                                !rejectionReason.trim()
                              }
                            >
                              {responding === notification._id
                                ? "Đang xử lý..."
                                : "Xác nhận từ chối"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                  {/* Chỉ hiển thị khi đã phản hồi */}
                  {notification.confirmation_status &&
                    notification.confirmation_status !== "Pending" && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          Đã phản hồi vào{" "}
                          {new Date(
                            notification.date ||
                              notification.examination_date ||
                              ""
                          ).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

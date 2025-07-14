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
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/auth";
import { fetchData } from "@/lib/api/api";

interface HealthExaminationNotification {
  _id: string;
  noti_campaign: string;
  content: string;
  notes: string;
  date: string;
  confirmation_status: "Pending" | "Agree" | "Disagree";
  student: {
    _id: string;
    name: string;
    class_name?: string;
  };
  // Data từ examination
  examination_date?: string;
  examination_time?: string;
  location?: string;
  doctor_name?: string;
  examination_type?: string;
}

export default function HealthExaminationNotifications() {
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
  useEffect(() => {
    fetchNotifications();
  }, [parentId]);

  const fetchNotifications = async () => {
    try {
      console.log(
        "Fetching health examination notifications for parent:",
        parentId
      );
      const response = await fetchData<any>(
        `/notifications/parent/${parentId}/health-examinations`
      );
      console.log("Fetched health examination notifications:", response);
      const data = response;

      setNotifications(data);
    } catch (error) {
      console.error("Error fetching health examination notifications:", error);
      toast.error("Không thể tải thông báo khám sức khỏe");
    } finally {
      setLoading(false);
    }
  };

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
          <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 font-semibold px-3 py-1 rounded-xl shadow-sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã đồng ý
          </Badge>
        );
      case "Disagree":
        return (
          <Badge className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300 font-semibold px-3 py-1 rounded-xl shadow-sm">
            <XCircle className="w-3 h-3 mr-1" />
            Đã từ chối
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gradient-to-r from-amber-100 to-yellow-200 text-amber-800 border border-amber-300 font-semibold px-3 py-1 rounded-xl shadow-sm">
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
      <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-6 rounded-2xl space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse bg-white/70 border-sky-200 shadow-lg rounded-2xl">
            <CardHeader className="pb-4">
              <div className="h-5 bg-sky-200 rounded-lg w-3/4"></div>
              <div className="h-4 bg-sky-100 rounded-lg w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-sky-100 rounded-lg w-full mb-3"></div>
              <div className="h-4 bg-sky-100 rounded-lg w-2/3 mb-3"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-sky-100 rounded-lg"></div>
                <div className="h-12 bg-sky-100 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200 shadow-lg rounded-2xl">
        <CardContent className="text-center py-12">
          <Calendar className="mx-auto h-16 w-16 text-sky-400 mb-6" />
          <p className="text-sky-600 font-medium text-lg">Không có thông báo lịch khám nào</p>
          <p className="text-sky-500 text-sm mt-2">Các thông báo mới sẽ hiển thị tại đây</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between bg-white/70 rounded-xl p-4 border border-sky-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-sky-800">
            📋 Thông báo lịch khám sức khỏe
          </h2>
          <p className="text-sky-600 text-sm mt-1">Quản lý lịch khám sức khỏe của con em</p>
        </div>
        <Badge className="bg-gradient-to-r from-amber-100 to-yellow-200 text-amber-800 border border-amber-300 font-semibold px-4 py-2 rounded-xl shadow-sm">
          {
            notifications.filter((n) => n.confirmation_status === "Pending")
              .length
          }{" "}
          chờ phản hồi
        </Badge>
      </div>

      {notifications.map((notification) => {
        const { description, date, time } = parseNotesForExaminationDetails(
          notification.notes
        );

        return (
          <Card key={notification._id} className="bg-white border border-sky-200 hover:bg-sky-50 transition-colors rounded-xl shadow-sm hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                    <h3 className="text-sky-800 font-semibold text-lg">
                      {notification.content}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sky-600 mb-3">
                    <User className="w-4 h-4" />
                    <span className="font-medium">
                      {notification.student.name}
                      {notification.student.class_name && ` - Lớp ${notification.student.class_name}`}
                    </span>
                  </div>
                </div>
                {getStatusBadge(notification.confirmation_status)}
              </div>

              {/* Compact Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <div>
                    <span className="text-xs text-gray-500 block">Ngày khám</span>
                    <span className="text-sky-800 font-medium">{date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <div>
                    <span className="text-xs text-gray-500 block">Giờ khám</span>
                    <span className="text-sky-800 font-medium">{time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-600" />
                  <div>
                    <span className="text-xs text-gray-500 block">Trạng thái</span>
                    <span className="text-sky-800 font-medium">
                      {notification.confirmation_status === "Pending" ? "Chờ phản hồi" :
                       notification.confirmation_status === "Agree" ? "Đã đồng ý" : "Từ chối"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-sky-50 rounded-lg p-3 border border-sky-100 mb-4">
                <p className="text-sky-700 text-sm leading-relaxed">{description}</p>
              </div>

              {/* Action Buttons */}
              {notification.confirmation_status === "Pending" && (
                <div className="flex gap-2 pt-2 border-t border-sky-100">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Đồng ý
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-sky-200 bg-white/95 backdrop-blur-sm rounded-2xl">
                      <DialogHeader className="border-b border-sky-100 pb-4">
                        <DialogTitle className="text-sky-800 text-lg font-semibold">
                          Xác nhận tham gia lịch khám
                        </DialogTitle>
                        <DialogDescription className="text-sky-600">
                          Bạn có muốn cho con tham gia lịch khám này không?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="block text-sky-800 font-semibold text-sm">
                            💬 Ghi chú (tùy chọn)
                          </label>
                          <Textarea
                            placeholder="Nhập ghi chú của bạn..."
                            value={responseNotes}
                            onChange={(e) => setResponseNotes(e.target.value)}
                            className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg min-h-[80px]"
                          />
                        </div>
                      </div>
                      <DialogFooter className="border-t border-sky-100 pt-4">
                        <Button
                          onClick={() =>
                            handleResponse(notification._id, "Agree")
                          }
                          disabled={responding === notification._id}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
                        >
                          {responding === notification._id
                            ? "Đang xử lý..."
                            : "✅ Xác nhận đồng ý"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Từ chối
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-sky-200 bg-white/95 backdrop-blur-sm rounded-2xl">
                      <DialogHeader className="border-b border-sky-100 pb-4">
                        <DialogTitle className="text-sky-800 text-lg font-semibold">
                          Từ chối lịch khám
                        </DialogTitle>
                        <DialogDescription className="text-sky-600">
                          Vui lòng cho biết lý do từ chối để chúng tôi có thể hỗ
                          trợ tốt hơn.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="block text-sky-800 font-semibold text-sm">
                            📝 Lý do từ chối <span className="text-red-500">*</span>
                          </label>
                          <Textarea
                            placeholder="Nhập lý do từ chối..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            required
                            className="border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-lg min-h-[80px]"
                          />
                        </div>
                      </div>
                      <DialogFooter className="border-t border-sky-100 pt-4">
                        <Button
                          onClick={() =>
                            handleResponse(notification._id, "Disagree")
                          }
                          disabled={
                            responding === notification._id ||
                            !rejectionReason.trim()
                          }
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {responding === notification._id
                            ? "Đang xử lý..."
                            : "❌ Xác nhận từ chối"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {notification.confirmation_status !== "Pending" && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Đã phản hồi vào{" "}
                    {new Date(notification.date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

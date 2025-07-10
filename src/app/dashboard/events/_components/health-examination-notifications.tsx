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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-blue-800">
          Thông báo lịch khám sức khỏe
        </h2>
        <Badge variant="outline" className="text-blue-600">
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
          <Card key={notification._id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-blue-800">
                    {notification.content}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Học sinh: {notification.student.name}
                    {notification.student.class_name &&
                      ` - Lớp ${notification.student.class_name}`}
                  </CardDescription>
                </div>
                {getStatusBadge(notification.confirmation_status)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-700">{description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-blue-600">
                  <Calendar className="w-4 h-4" />
                  <span>Ngày khám: {date}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span>Giờ khám: {time}</span>
                </div>
              </div>

              {notification.confirmation_status === "Pending" && (
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
                        <DialogTitle>Xác nhận tham gia lịch khám</DialogTitle>
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
                          Vui lòng cho biết lý do từ chối để chúng tôi có thể hỗ
                          trợ tốt hơn.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Lý do từ chối..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
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

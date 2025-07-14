"use client";

import { useState, useEffect } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  User,
  Syringe,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { fetchData } from "@/lib/api/api";

interface VaccinationNotification {
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
  // Data từ vaccination schedule
  vaccination_date?: string;
  vaccination_time?: string;
  location?: string;
  doctor_name?: string;
  vaccine_type?: string;
}

export default function VaccinationNotifications() {
  const [notifications, setNotifications] = useState<VaccinationNotification[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] =
    useState<VaccinationNotification | null>(null);
  const [responseNotes, setResponseNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [respondingToNotification, setRespondingToNotification] =
    useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // TODO: Replace with actual parent ID from auth context
      const parentId = "current-parent-id";
      const data = await fetchData<VaccinationNotification[]>(
        `/notifications/parent/${parentId}?type=VaccinationSchedule`
      );
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching vaccination notifications:", error);
      toast.error("Không thể tải thông báo tiêm chủng");
    } finally {
      setLoading(false);
    }
  };

  const respondToNotification = async (
    notificationId: string,
    status: "Agree" | "Disagree",
    notes?: string,
    rejectionReason?: string
  ) => {
    setRespondingToNotification(true);
    try {
      await fetchData(`/notifications/${notificationId}/respond`, {
        method: "POST",
        body: JSON.stringify({
          status,
          notes,
          rejectionReason,
        }),
      });

      toast.success(
        status === "Agree"
          ? "Đã xác nhận tham gia tiêm chủng"
          : "Đã từ chối tham gia tiêm chủng"
      );

      // Refresh notifications
      fetchNotifications();
      setSelectedNotification(null);
      setResponseNotes("");
      setRejectionReason("");
    } catch (error) {
      console.error("Error responding to notification:", error);
      toast.error("Không thể phản hồi thông báo");
    } finally {
      setRespondingToNotification(false);
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

  const parseNotesForVaccinationDetails = (notes: string) => {
    const lines = notes.split("\\n");
    const description = lines[0] || "";
    const date =
      lines.find((line) => line.startsWith("Ngày tiêm:"))?.split(": ")[1] || "";
    const time =
      lines.find((line) => line.startsWith("Giờ tiêm:"))?.split(": ")[1] || "";
    const location =
      lines.find((line) => line.startsWith("Địa điểm:"))?.split(": ")[1] || "";
    const doctor =
      lines.find((line) => line.startsWith("Bác sĩ:"))?.split(": ")[1] || "";
    const vaccineType =
      lines.find((line) => line.startsWith("Loại vắc-xin:"))?.split(": ")[1] ||
      "";

    return { description, date, time, location, doctor, vaccineType };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-blue-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-800">
          Thông báo tiêm chủng
        </h3>
        <Badge variant="outline" className="text-blue-600">
          {
            notifications.filter((n) => n.confirmation_status === "Pending")
              .length
          }{" "}
          chờ phản hồi
        </Badge>
      </div>

      {notifications.map((notification) => {
        const { description, date, time, location, doctor, vaccineType } =
          parseNotesForVaccinationDetails(notification.notes);

        return (
          <Card key={notification._id} className="bg-white border border-blue-200 hover:bg-blue-50 transition-colors rounded-xl shadow-sm hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h3 className="text-blue-800 font-semibold text-lg">
                      {notification.content}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 mb-3">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-xs text-gray-500 block">Ngày tiêm</span>
                    <span className="text-blue-800 font-medium text-sm">{date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-xs text-gray-500 block">Giờ tiêm</span>
                    <span className="text-blue-800 font-medium text-sm">{time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-xs text-gray-500 block">Địa điểm</span>
                    <span className="text-blue-800 font-medium text-sm">{location || "Chưa xác định"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Syringe className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-xs text-gray-500 block">Loại vắc-xin</span>
                    <span className="text-blue-800 font-medium text-sm">{vaccineType || "Chưa xác định"}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 mb-4">
                <p className="text-blue-700 text-sm leading-relaxed">{description}</p>
              </div>

              {/* Action Buttons */}
              {notification.confirmation_status === "Pending" && (
                <div className="flex gap-2 pt-2 border-t border-blue-100">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setSelectedNotification(notification);
                          setResponseNotes("");
                          setRejectionReason("");
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Đồng ý
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Xác nhận tham gia tiêm chủng</DialogTitle>
                        <DialogDescription>
                          Bạn đồng ý cho con em tham gia tiêm chủng này?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="response-notes">
                            Ghi chú (tùy chọn)
                          </Label>
                          <Textarea
                            id="response-notes"
                            value={responseNotes}
                            onChange={(e) => setResponseNotes(e.target.value)}
                            placeholder="Ghi chú thêm từ phụ huynh..."
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedNotification(null)}
                          >
                            Hủy
                          </Button>
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              respondToNotification(
                                notification._id,
                                "Agree",
                                responseNotes
                              )
                            }
                            disabled={respondingToNotification}
                          >
                            {respondingToNotification
                              ? "Đang xử lý..."
                              : "Xác nhận đồng ý"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setSelectedNotification(notification);
                          setResponseNotes("");
                          setRejectionReason("");
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Từ chối
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Từ chối tham gia tiêm chủng</DialogTitle>
                        <DialogDescription>
                          Vui lòng cho biết lý do từ chối để nhà trường hiểu rõ
                          hơn.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="rejection-reason">
                            Lý do từ chối *
                          </Label>
                          <Textarea
                            id="rejection-reason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Vui lòng cho biết lý do từ chối..."
                            rows={3}
                            required
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedNotification(null)}
                          >
                            Hủy
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              respondToNotification(
                                notification._id,
                                "Disagree",
                                undefined,
                                rejectionReason
                              )
                            }
                            disabled={
                              respondingToNotification ||
                              !rejectionReason.trim()
                            }
                          >
                            {respondingToNotification
                              ? "Đang xử lý..."
                              : "Xác nhận từ chối"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {notification.confirmation_status === "Agree" && (
                <div className="bg-green-50 p-3 rounded-md">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">
                      Đã xác nhận tham gia tiêm chủng
                    </span>
                  </div>
                  {responseNotes && (
                    <p className="text-sm text-green-700 mt-1">
                      Ghi chú: {responseNotes}
                    </p>
                  )}
                </div>
              )}

              {notification.confirmation_status === "Disagree" && (
                <div className="bg-red-50 p-3 rounded-md">
                  <div className="flex items-center gap-2 text-red-800">
                    <XCircle className="w-4 h-4" />
                    <span className="font-medium">
                      Đã từ chối tham gia tiêm chủng
                    </span>
                  </div>
                  {rejectionReason && (
                    <p className="text-sm text-red-700 mt-1">
                      Lý do: {rejectionReason}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {notifications.length === 0 && (
        <div className="text-center py-8">
          <Syringe className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Chưa có thông báo tiêm chủng nào
          </h3>
          <p className="text-gray-500">
            Các thông báo về lịch tiêm chủng sẽ xuất hiện tại đây.
          </p>
        </div>
      )}
    </div>
  );
}

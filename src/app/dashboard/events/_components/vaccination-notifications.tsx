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
import { useParentStudentsStore } from "@/stores/parent-students-store";

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
  const { studentsData, fetchVaccinationSchedulesPending } =
    useParentStudentsStore();
  const [pendingVaccinations, setPendingVaccinations] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifications();
    fetchPendingVaccinations();
  }, [studentsData]);

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

  const fetchPendingVaccinations = async () => {
    if (!studentsData || studentsData.length === 0) {
      setPendingVaccinations([]);
      return;
    }
    try {
      const allResults = await Promise.all(
        studentsData.map((student: any) =>
          fetchVaccinationSchedulesPending(student.student._id).then(
            (res: any) =>
              (res || []).map((item: any) => ({
                ...item,
                student: student.student,
              }))
          )
        )
      );
      setPendingVaccinations(allResults.flat());
    } catch (error) {
      setPendingVaccinations([]);
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

  // Helper to calculate days remaining
  function calculateDaysRemaining(dateString: string) {
    if (!dateString) return 9999;
    const examDate = new Date(dateString);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Chia pendingVaccinations thành 2 nhóm
  const importantVaccinations = pendingVaccinations.filter((vacc: any) => {
    const days = calculateDaysRemaining(vacc.vaccination_date);
    return days <= 14;
  });
  const upcomingVaccinations = pendingVaccinations.filter((vacc: any) => {
    const days = calculateDaysRemaining(vacc.vaccination_date);
    return days > 14;
  });

  function formatDateOnly(dateString: string) {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-blue-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Thông báo quan trọng */}
      {importantVaccinations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-blue-800">
            Thông báo quan trọng
          </h3>
          {importantVaccinations.map((vacc: any) => (
            <Card key={vacc._id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-blue-800">
                      {vacc.title || "Lịch tiêm chủng"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Học sinh: {vacc.student?.name}
                      {vacc.student?.class?.name &&
                        ` - Lớp ${vacc.student.class.name}`}
                    </CardDescription>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Chờ xác nhận
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Syringe className="w-4 h-4" />
                    <span>Tên vắc-xin: {vacc.vaccine_type || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Thời gian tiêm: {formatDateOnly(vacc.vaccination_date)}
                      {vacc.vaccination_time
                        ? ` lúc ${vacc.vaccination_time}`
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <MapPin className="w-4 h-4" />
                    <span>Địa điểm: {vacc.location || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <User className="w-4 h-4" />
                    <span>Bác sĩ phụ trách: {vacc.doctor_name || "-"}</span>
                  </div>
                </div>
                {vacc.description && (
                  <div className="text-blue-700 text-sm">
                    <span className="font-medium">Ghi chú:</span>{" "}
                    {vacc.description}
                  </div>
                )}
                {/* Nút đồng ý và không đồng ý */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => respondToNotification(vacc._id, "Agree")}
                  >
                    Đồng ý
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => respondToNotification(vacc._id, "Disagree")}
                  >
                    Không đồng ý
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Sự kiện sắp tới */}
      {upcomingVaccinations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-blue-800">
            Sự kiện sắp tới
          </h3>
          {upcomingVaccinations.map((vacc: any) => (
            <Card key={vacc._id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-blue-800">
                      {vacc.title || "Lịch tiêm chủng"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Học sinh: {vacc.student?.name}
                      {vacc.student?.class?.name &&
                        ` - Lớp ${vacc.student.class.name}`}
                    </CardDescription>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Chờ xác nhận
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Syringe className="w-4 h-4" />
                    <span>Tên vắc-xin: {vacc.vaccine_type || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Thời gian tiêm: {formatDateOnly(vacc.vaccination_date)}
                      {vacc.vaccination_time
                        ? ` lúc ${vacc.vaccination_time}`
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <MapPin className="w-4 h-4" />
                    <span>Địa điểm: {vacc.location || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <User className="w-4 h-4" />
                    <span>Bác sĩ phụ trách: {vacc.doctor_name || "-"}</span>
                  </div>
                </div>
                {vacc.description && (
                  <div className="text-blue-700 text-sm">
                    <span className="font-medium">Ghi chú:</span>{" "}
                    {vacc.description}
                  </div>
                )}
                {/* Nút đồng ý và không đồng ý */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => respondToNotification(vacc._id, "Agree")}
                  >
                    Đồng ý
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => respondToNotification(vacc._id, "Disagree")}
                  >
                    Không đồng ý
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Danh sách các thông báo lịch sử */}
      {notifications.map((notification) => {
        const { description, date, time, location, doctor, vaccineType } =
          parseNotesForVaccinationDetails(notification.notes);
        return (
          <div
            key={notification._id}
            className={
              "flex items-start gap-3 p-3 rounded-lg border border-blue-100 bg-blue-50"
            }
          >
            <div className="rounded-full p-2 bg-blue-100">
              <Syringe className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-800">
                {notification.content || "Lịch sử tiêm chủng"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-1">
                <div className="flex items-center gap-2 text-blue-600">
                  <Syringe className="w-4 h-4" />
                  <span>
                    Tên vắc-xin:{" "}
                    {vaccineType || notification.vaccine_type || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <User className="w-4 h-4" />
                  <span>
                    Học sinh: {notification.student?.name || "-"}
                    {notification.student?.class_name &&
                      ` - Lớp ${notification.student.class_name}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Thời gian tiêm:{" "}
                    {formatDateOnly(date || notification.vaccination_date)}
                    {time || notification.vaccination_time
                      ? ` lúc ${time || notification.vaccination_time}`
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    Địa điểm: {location || notification.location || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <User className="w-4 h-4" />
                  <span>
                    Bác sĩ phụ trách:{" "}
                    {doctor || notification.doctor_name || "-"}
                  </span>
                </div>
              </div>
              {description && (
                <div className="text-blue-700 text-sm mt-2">
                  <span className="font-medium">Ghi chú:</span> {description}
                </div>
              )}
              <div className="mt-2 flex items-center gap-2">
                {getStatusBadge(notification.confirmation_status)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  Users,
  Syringe,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchData } from "@/lib/api/api";

interface VaccinationEvent {
  _id: string;
  title: string;
  description: string;
  vaccination_date: string;
  vaccination_time: string;
  location?: string;
  doctor_name?: string;
  vaccine_type?: string;
  grade_levels: number[];
  total_students: number;
  approved_count: number;
  pending_count: number;
  rejected_count: number;
  completed_count: number;
  classes: ClassInfo[];
}

interface ClassInfo {
  class_id: string;
  class_name: string;
  grade_level: number;
  approved_count: number;
  pending_count: number;
  rejected_count: number;
  completed_count: number;
}

export default function AllVaccinationScheduleEventList() {
  const [events, setEvents] = useState<VaccinationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected" | "completed"
  >("all");
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await fetchData<any>("/vaccination-schedules/events");
      console.log(data);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Không thể tải danh sách sự kiện tiêm chủng");
    } finally {
      setLoading(false);
    }
  };

  const handleViewEventDetail = (eventId: string) => {
    router.push(`/cms/vaccinations/events/${eventId}`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sự kiện tiêm chủng này?")) {
      return;
    }

    try {
      await fetchData(`/vaccination-schedules/${eventId}`, {
        method: "DELETE",
      });
      toast.success("Xóa sự kiện tiêm chủng thành công");
      fetchEvents(); // Refresh list
    } catch (error) {
      console.error("Error deleting event:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Lỗi không xác định";
      toast.error(`Không thể xóa sự kiện tiêm: ${errorMessage}`);
    }
  };

  const getStatusBadge = (
    approved: number,
    pending: number,
    rejected: number,
    completed: number,
    total: number
  ) => {
    const approvalRate = total > 0 ? (approved / total) * 100 : 0;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    if (completionRate >= 80) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Hoàn thành tốt ({Math.round(completionRate)}%)
        </Badge>
      );
    } else if (approvalRate >= 70) {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đang tiến hành ({Math.round(approvalRate)}% đồng ý)
        </Badge>
      );
    } else if (pending > approved) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Chờ phản hồi
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Cần xem xét
        </Badge>
      );
    }
  };

  const getGradeLevelsDisplay = (gradeLevels: number[]) => {
    if (gradeLevels.length === 0) return "Cá nhân";
    if (gradeLevels.length === 1) return `Khối ${gradeLevels[0]}`;
    return `Khối ${gradeLevels.sort().join(", ")}`;
  };

  const getVaccineTypeDisplay = (type: string) => {
    const typeMap: { [key: string]: string } = {
      flu: "Cúm mùa",
      hepatitis_b: "Viêm gan B",
      measles: "Sởi",
      polio: "Bại liệt",
      dpt: "DPT",
      covid19: "COVID-19",
    };
    return typeMap[type || ""] || type || "Không xác định";
  };

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;

    const totalStudents = event.total_students;
    const approvalRate =
      totalStudents > 0 ? (event.approved_count / totalStudents) * 100 : 0;
    const completionRate =
      totalStudents > 0 ? (event.completed_count / totalStudents) * 100 : 0;

    switch (filter) {
      case "pending":
        return event.pending_count > 0;
      case "approved":
        return approvalRate >= 50;
      case "rejected":
        return event.rejected_count > 0;
      case "completed":
        return completionRate >= 80;
      default:
        return true;
    }
  });

  // Helper to check if a date is today
  function isToday(dateString: string) {
    if (!dateString) return false;
    const d = new Date(dateString);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }

  const todayEvents = events.filter((event) => isToday(event.vaccination_date));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-blue-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800">Lịch tiêm hôm nay</CardTitle>
          <CardDescription>
            Danh sách các sự kiện tiêm chủng diễn ra trong ngày hôm nay
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Chỉ hiển thị sự kiện hôm nay */}
          {todayEvents.length === 0 ? (
            <div className="text-center text-blue-600 py-6">
              Hiện không có lịch tiêm nào trong ngày hôm nay
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thông tin sự kiện</TableHead>
                  <TableHead>Khối lớp</TableHead>
                  <TableHead>Ngày & Giờ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayEvents.map((event) => (
                  <TableRow
                    key={event._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-blue-800">
                          {event.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {event.description.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {event.vaccine_type && (
                            <span className="flex items-center gap-1">
                              <Syringe className="w-3 h-3" />
                              {event.vaccine_type}
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          )}
                          {event.doctor_name && (
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {event.doctor_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">
                            {getGradeLevelsDisplay(event.grade_levels)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {event.classes.length} lớp, {event.total_students} học
                          sinh
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          {new Date(event.vaccination_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-3 h-3" />
                          {event.vaccination_time}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(
                        event.approved_count,
                        event.pending_count,
                        event.rejected_count,
                        event.completed_count,
                        event.total_students
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewEventDetail(event._id)}
                          title="Xem chi tiết sự kiện"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event._id);
                          }}
                          title="Xóa sự kiện"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

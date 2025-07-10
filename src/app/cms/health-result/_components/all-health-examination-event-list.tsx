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
  Users,
  Stethoscope,
  GraduationCap,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchData } from "@/lib/api/api";

interface HealthExaminationEvent {
  _id: string;
  title: string;
  description: string;
  examination_date: string;
  examination_time: string;
  location?: string;
  doctor_name?: string;
  examination_type?: string;
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

export default function AllHealthExaminationEventList() {
  const [events, setEvents] = useState<HealthExaminationEvent[]>([]);
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
      const data = await fetchData<any>("/health-examinations/events");
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Không thể tải danh sách sự kiện khám sức khỏe");
    } finally {
      setLoading(false);
    }
  };

  const handleViewEventDetail = (eventId: string) => {
    router.push(`/cms/health-result/events/${eventId}`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn xóa sự kiện khám này? Điều này sẽ xóa tất cả các lịch khám liên quan."
      )
    )
      return;

    try {
      console.log("Deleting event with ID:", eventId);

      const response = await fetchData<any>(
        `/health-examinations/events/${eventId}`,
        {
          method: "DELETE",
        }
      );

      if (response) {
        toast.success("Đã xóa sự kiện khám");
        setEvents((prev) => prev.filter((event) => event._id !== eventId));
      } else {
        const errorData = response;
        console.error("Delete error:", errorData);
        throw new Error("error");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Lỗi không xác định";
      toast.error(`Không thể xóa sự kiện khám: ${errorMessage}`);
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
    if (gradeLevels.length === 0) return "Không xác định";
    if (gradeLevels.length === 1) return `Khối ${gradeLevels[0]}`;
    if (gradeLevels.length <= 3) {
      return gradeLevels.map((level) => `Khối ${level}`).join(", ");
    }
    return `${gradeLevels.length} khối (${gradeLevels[0]}-${
      gradeLevels[gradeLevels.length - 1]
    })`;
  };

  const getExaminationTypeDisplay = (type?: string) => {
    const typeMap: { [key: string]: string } = {
      "Khám sức khỏe định kỳ": "Định kỳ",
      "Khám răng miệng": "Răng miệng",
      "Khám mắt": "Mắt",
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
          <CardTitle className="text-blue-800">
            Tất cả sự kiện khám sức khỏe
          </CardTitle>
          <CardDescription>
            Quản lý toàn bộ các sự kiện khám sức khỏe theo khối lớp
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter buttons */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Tất cả ({events.length})
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Chờ phản hồi
            </Button>
            <Button
              variant={filter === "approved" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("approved")}
              className="bg-green-600 hover:bg-green-700"
            >
              Đã duyệt
            </Button>
            <Button
              variant={filter === "rejected" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("rejected")}
              className="bg-red-600 hover:bg-red-700"
            >
              Từ chối
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Hoàn thành
            </Button>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {filter === "all"
                  ? "Chưa có sự kiện khám nào"
                  : `Không có sự kiện nào ${filter}`}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thông tin sự kiện</TableHead>
                  <TableHead>Khối lớp</TableHead>
                  <TableHead>Ngày & Giờ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
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
                          {event.examination_type && (
                            <span className="flex items-center gap-1">
                              <Stethoscope className="w-3 h-3" />
                              {event.examination_type}
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
                          {new Date(event.examination_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-3 h-3" />
                          {event.examination_time}
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
                          variant="destructive"
                          onClick={() => handleDeleteEvent(event._id)}
                          title="Xóa sự kiện"
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

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
  ChevronRight,
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
 
export default function HealthExaminationEventList() {
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
      const response = await fetchData<any>("/health-examinations/events");
      setEvents(response);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Không thể tải danh sách sự kiện khám sức khỏe");
    } finally {
      setLoading(false);
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
    } else if (approvalRate >= 60) {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đang thực hiện ({Math.round(approvalRate)}% đồng ý)
        </Badge>
      );
    } else if (pending > approved + rejected + completed) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Chờ phản hồi
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800">
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

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;

    const totalStudents = event.total_students;
    if (totalStudents === 0) return false;

    switch (filter) {
      case "pending":
        return event.pending_count > 0;
      case "approved":
        return event.approved_count > 0;
      case "rejected":
        return event.rejected_count > 0;
      case "completed":
        return event.completed_count > 0;
      default:
        return true;
    }
  });
  const handleViewEventDetail = (eventId: string) => {
    router.push(`/admin/health-result/events/${eventId}`);
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Danh sách sự kiện khám sức khỏe
          </CardTitle>
          <CardDescription>
            Quản lý các sự kiện khám sức khỏe theo khối lớp và theo dõi tiến độ
            thực hiện.
            <span className="font-medium text-blue-600">
              {" "}
              Click vào sự kiện để xem chi tiết.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              size="sm"
            >
              Tất cả
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => setFilter("pending")}
              size="sm"
            >
              Chờ phản hồi
            </Button>
            <Button
              variant={filter === "approved" ? "default" : "outline"}
              onClick={() => setFilter("approved")}
              size="sm"
            >
              Đã đồng ý
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              onClick={() => setFilter("completed")}
              size="sm"
            >
              Đã hoàn thành
            </Button>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
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
                  <TableHead>Tên sự kiện</TableHead>
                  <TableHead>Ngày khám</TableHead>
                  <TableHead>Khối lớp</TableHead>
                  <TableHead>Số học sinh</TableHead>
                  <TableHead>Tỷ lệ hoàn thành</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => {
                  const completionRate = event.total_students > 0 
                    ? (event.completed_count / event.total_students) * 100 
                    : 0;
                  return (
                    <TableRow
                      key={event._id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleViewEventDetail(event._id)}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-blue-800">
                            {event.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {event.description.substring(0, 80)}...
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
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">
                              {getGradeLevelsDisplay(event.grade_levels)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {event.classes.length} lớp
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{event.total_students}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {(() => {
                          if (completionRate >= 80) {
                            return (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {Math.round(completionRate)}%
                              </Badge>
                            );
                          } else if (completionRate >= 60) {
                            return (
                              <Badge className="bg-blue-100 text-blue-800">
                                {Math.round(completionRate)}%
                              </Badge>
                            );
                          } else if (completionRate >= 40) {
                            return (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                {Math.round(completionRate)}%
                              </Badge>
                            );
                          } else {
                            return (
                              <Badge className="bg-red-100 text-red-800">
                                {Math.round(completionRate)}%
                              </Badge>
                            );
                          }
                        })()}
                      </TableCell>

                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

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
  Syringe,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchData } from "@/lib/api/api";

interface VaccinationEventDetail {
  event_id: string;
  title: string;
  vaccination_date: string;
  vaccination_time: string;
  location?: string;
  classes: ClassDetail[];
}

interface ClassDetail {
  class_id: string;
  class_name: string;
  grade_level: number;
  total_students: number;
  approved_count: number;
  pending_count: number;
  rejected_count: number;
  completed_count: number;
}

interface Props {
  eventId: string;
}

export default function VaccinationEventDetail({ eventId }: Props) {
  const [eventDetail, setEventDetail] = useState<VaccinationEventDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchEventDetail();
  }, [eventId]);

  const fetchEventDetail = async () => {
    try {
      const data = await fetchData<VaccinationEventDetail>(
        `/vaccination-schedules/events/${eventId}`
      );
      setEventDetail(data);
    } catch (error) {
      console.error("Error fetching event detail:", error);
      toast.error("Không thể tải chi tiết sự kiện tiêm chủng");
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
          Hoàn thành ({Math.round(completionRate)}%)
        </Badge>
      );
    } else if (approvalRate >= 60) {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đang thực hiện ({Math.round(approvalRate)}%)
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

  const handleViewClassDetail = (classId: string) => {
    router.push(`/cms/vaccinations/events/${eventId}/classes/${classId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-blue-600">Đang tải...</div>
      </div>
    );
  }

  if (!eventDetail) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          Không tìm thấy sự kiện
        </h3>
        <p className="text-gray-500">
          Sự kiện tiêm chủng này không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    );
  }

  const totalStudents = eventDetail.classes.reduce(
    (sum, cls) => sum + cls.total_students,
    0
  );
  const totalApproved = eventDetail.classes.reduce(
    (sum, cls) => sum + cls.approved_count,
    0
  );
  const totalPending = eventDetail.classes.reduce(
    (sum, cls) => sum + cls.pending_count,
    0
  );
  const totalRejected = eventDetail.classes.reduce(
    (sum, cls) => sum + cls.rejected_count,
    0
  );
  const totalCompleted = eventDetail.classes.reduce(
    (sum, cls) => sum + cls.completed_count,
    0
  );

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Syringe className="w-6 h-6" />
            {eventDetail.title}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm">
                {new Date(eventDetail.vaccination_date).toLocaleDateString(
                  "vi-VN"
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm">{eventDetail.vaccination_time}</span>
            </div>
            {eventDetail.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{eventDetail.location}</span>
              </div>
            )}
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalStudents}
              </div>
              <div className="text-sm text-gray-500">Tổng HS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {totalPending}
              </div>
              <div className="text-sm text-gray-500">Chờ phản hồi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalApproved}
              </div>
              <div className="text-sm text-gray-500">Đã đồng ý</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {totalRejected}
              </div>
              <div className="text-sm text-gray-500">Đã từ chối</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalCompleted}
              </div>
              <div className="text-sm text-gray-500">Hoàn thành</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Classes List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800">Danh sách lớp học</CardTitle>
          <CardDescription>
            Click vào lớp để xem chi tiết học sinh và cập nhật kết quả tiêm
            chủng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lớp học</TableHead>
                <TableHead>Số lượng HS</TableHead>
                <TableHead>Chờ phản hồi</TableHead>
                <TableHead>Đã đồng ý</TableHead>
                <TableHead>Đã từ chối</TableHead>
                <TableHead>Hoàn thành</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventDetail.classes
                .sort((a, b) => a.grade_level - b.grade_level)
                .map((classDetail) => (
                  <TableRow
                    key={classDetail.class_id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewClassDetail(classDetail.class_id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="font-medium">
                            {classDetail.class_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Khối {classDetail.grade_level}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {classDetail.total_students}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {classDetail.pending_count}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">
                        {classDetail.approved_count}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800">
                        {classDetail.rejected_count}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        {classDetail.completed_count}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(
                        classDetail.approved_count,
                        classDetail.pending_count,
                        classDetail.rejected_count,
                        classDetail.completed_count,
                        classDetail.total_students
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewClassDetail(classDetail.class_id);
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

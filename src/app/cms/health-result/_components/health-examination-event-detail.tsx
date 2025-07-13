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
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchData } from "@/lib/api/api";

interface EventDetail {
  event_id: string;
  title: string;
  examination_date: string;
  examination_time: string;
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

export default function HealthExaminationEventDetail({ eventId }: Props) {
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchEventDetail();
  }, [eventId]);

  const fetchEventDetail = async () => {
    try {
      const data = await fetchData<any>(
        `/health-examinations/events/${eventId}`
      );

      // Ensure classes is an array
      if (data && !Array.isArray(data.classes)) {
        console.warn("Event detail classes is not an array:", data.classes);
        data.classes = [];
      }

      setEventDetail(data);
    } catch (error) {
      console.error("Error fetching event detail:", error);
      toast.error("Không thể tải chi tiết sự kiện");
    } finally {
      setLoading(false);
    }
  };

  const getClassStatusBadge = (
    approved: number,
    pending: number,
    rejected: number,
    completed: number,
    total: number
  ) => {
    if (total === 0) {
      return (
        <Badge className="bg-gray-100 text-gray-800">
          <XCircle className="w-3 h-3 mr-1" />
          Không có học sinh
        </Badge>
      );
    }

    const approvalRate = (approved / total) * 100;
    const completionRate = (completed / total) * 100;

    if (completionRate >= 80) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Hoàn thành ({Math.round(completionRate)}%)
        </Badge>
      );
    } else if (completionRate > 0) {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đang khám ({Math.round(completionRate)}%)
        </Badge>
      );
    } else if (approvalRate >= 60) {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Sẵn sàng ({Math.round(approvalRate)}%)
        </Badge>
      );
    } else if (pending > approved + rejected) {
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

  const handleViewClassDetail = (classId: string) => {
    router.push(`/cms/health-result/events/${eventId}/classes/${classId}`);
  };

  const handleBack = () => {
    router.push("/cms/health-result");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!eventDetail) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">Không tìm thấy thông tin sự kiện</p>
        <Button variant="outline" onClick={handleBack} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  const totalStats = (eventDetail.classes || []).reduce(
    (acc, cls) => ({
      total: acc.total + (cls.total_students || 0),
      approved: acc.approved + (cls.approved_count || 0),
      pending: acc.pending + (cls.pending_count || 0),
      rejected: acc.rejected + (cls.rejected_count || 0),
      completed: acc.completed + (cls.completed_count || 0),
    }),
    { total: 0, approved: 0, pending: 0, rejected: 0, completed: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={handleBack} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Chi tiết sự kiện khám sức khỏe
          </h1>
        </div>
      </div>

      {/* Event Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            {eventDetail.title}
          </CardTitle>
          <CardDescription>
            Thông tin chi tiết và danh sách các lớp tham gia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm">
                {new Date(eventDetail.examination_date).toLocaleDateString(
                  "vi-VN"
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm">{eventDetail.examination_time}</span>
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
                {totalStats.total}
              </div>
              <div className="text-sm text-gray-600">Tổng học sinh</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalStats.approved}
              </div>
              <div className="text-sm text-gray-600">Đã đồng ý</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {totalStats.pending}
              </div>
              <div className="text-sm text-gray-600">Chờ phản hồi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {totalStats.rejected}
              </div>
              <div className="text-sm text-gray-600">Từ chối</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {totalStats.completed}
              </div>
              <div className="text-sm text-gray-600">Hoàn thành</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lớp tham gia</CardTitle>
          <CardDescription>
            Theo dõi tình trạng thực hiện khám sức khỏe của từng lớp.
            <span className="font-medium text-blue-600">
              {" "}
              Click vào lớp để xem chi tiết học sinh.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {eventDetail.classes.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">
                Không có lớp nào trong sự kiện này
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lớp</TableHead>
                  <TableHead>Tổng học sinh</TableHead>
                  <TableHead>Đã đồng ý</TableHead>
                  <TableHead>Chờ phản hồi</TableHead>
                  <TableHead>Từ chối</TableHead>
                  <TableHead>Hoàn thành</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventDetail.classes
                  .sort(
                    (a, b) =>
                      a.grade_level - b.grade_level ||
                      a.class_name.localeCompare(b.class_name)
                  )
                  .map((classDetail) => (
                    <TableRow
                      key={classDetail.class_id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        handleViewClassDetail(classDetail.class_id)
                      }
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">
                              {classDetail.class_name}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Khối {classDetail.grade_level}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-600" />
                          <span className="font-medium">
                            {classDetail.total_students}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-green-600 font-medium">
                          {classDetail.approved_count}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-yellow-600 font-medium">
                          {classDetail.pending_count}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-red-600 font-medium">
                          {classDetail.rejected_count}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-purple-600 font-medium">
                          {classDetail.completed_count}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getClassStatusBadge(
                          classDetail.approved_count,
                          classDetail.pending_count,
                          classDetail.rejected_count,
                          classDetail.completed_count,
                          classDetail.total_students
                        )}
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
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

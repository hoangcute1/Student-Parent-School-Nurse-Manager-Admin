"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { fetchData } from "@/lib/api/api";

export default function VaccinationEventDetailPage() {
  const router = useRouter();
  const { eventId } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchData(
          `/vaccination-schedules/events/${eventId}`
        );
        setEvent(data);
      } catch (err: any) {
        setError(err.message || "Không thể tải chi tiết sự kiện");
      } finally {
        setLoading(false);
      }
    }
    if (eventId) fetchEvent();
  }, [eventId]);

  if (loading)
    return (
      <div className="p-8 text-center text-2xl font-bold text-blue-700">
        Y tế học đường
        <br />
        <span className="text-sky-500 text-base font-normal block mt-2">
          Đang tải dữ liệu, vui lòng chờ...
        </span>
      </div>
    );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!event)
    return <div className="p-8 text-center">Không tìm thấy sự kiện</div>;

  // Tổng hợp số liệu
  const totalStudents =
    event.classes?.reduce(
      (sum: number, c: any) => sum + (c.total_students || 0),
      0
    ) || 0;
  const agreed =
    event.classes?.reduce(
      (sum: number, c: any) => sum + (c.approved_count || 0),
      0
    ) || 0;
  const pending =
    event.classes?.reduce(
      (sum: number, c: any) => sum + (c.pending_count || 0),
      0
    ) || 0;
  const rejected =
    event.classes?.reduce(
      (sum: number, c: any) => sum + (c.rejected_count || 0),
      0
    ) || 0;
  const completed =
    event.classes?.reduce(
      (sum: number, c: any) => sum + (c.completed_count || 0),
      0
    ) || 0;

  const getClassStatusBadge = (cls: any) => {
    if (cls.total_students === 0) {
      return (
        <Badge className="bg-gray-100 text-gray-800">Không có học sinh</Badge>
      );
    }
    if (cls.completed_count === cls.total_students && cls.total_students > 0) {
      return (
        <Badge className="bg-green-100 text-green-800">Hoàn thành (100%)</Badge>
      );
    }
    if (cls.completed_count > 0) {
      const percent = Math.round(
        (cls.completed_count / cls.total_students) * 100
      );
      return (
        <Badge className="bg-blue-100 text-blue-800">
          Đang thực hiện ({percent}%)
        </Badge>
      );
    }
    if (cls.approved_count > 0) {
      const percent = Math.round(
        (cls.approved_count / cls.total_students) * 100
      );
      return (
        <Badge className="bg-blue-100 text-blue-800">
          Sẵn sàng ({percent}%)
        </Badge>
      );
    }
    if (cls.pending_count > cls.approved_count + cls.rejected_count) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">Chờ phản hồi</Badge>
      );
    }
    return <Badge className="bg-red-100 text-red-800">Cần xem xét</Badge>;
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="secondary"
              className="flex items-center gap-2 text-blue-800 bg-blue-100 border-none hover:bg-blue-200 font-semibold rounded-full px-5 py-2 shadow-sm mb-2"
              onClick={() => router.push("/admin/vaccination-management")}
            >
              <span className="text-xl">&larr;</span>
              <span>Quay lại</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              Chi tiết sự kiện tiêm chủng
            </h1>
          </div>
        </div>

        {/* Event Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-700" />
              {event.title}
            </CardTitle>
            <CardDescription>{event.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm">
                  {event.vaccination_date
                    ? new Date(event.vaccination_date).toLocaleDateString(
                        "vi-VN"
                      )
                    : "-"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{event.vaccination_time || "-"}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">{event.location}</span>
                </div>
              )}
            </div>
            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {totalStudents}
                </div>
                <div className="text-sm text-gray-600">Tổng học sinh</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {agreed}
                </div>
                <div className="text-sm text-gray-600">Đã đồng ý</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {pending}
                </div>
                <div className="text-sm text-gray-600">Chờ phản hồi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {rejected}
                </div>
                <div className="text-sm text-gray-600">Từ chối</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {completed}
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
              Theo dõi tình trạng thực hiện tiêm chủng của từng lớp.
              <span className="font-medium text-blue-600">
                {" "}
                Click vào lớp để xem chi tiết học sinh.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                {event.classes?.map((cls: any) => (
                  <TableRow
                    key={cls.class_id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      router.push(
                        `/admin/vaccination-management/event/${eventId}/class/${cls.class_id}`
                      )
                    }
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{cls.class_name}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Khối {cls.grade_level}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">
                          {cls.total_students}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600 font-medium">
                        {cls.approved_count}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-yellow-600 font-medium">
                        {cls.pending_count}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-red-600 font-medium">
                        {cls.rejected_count}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-purple-600 font-medium">
                        {cls.completed_count}
                      </span>
                    </TableCell>
                    <TableCell>{getClassStatusBadge(cls)}</TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

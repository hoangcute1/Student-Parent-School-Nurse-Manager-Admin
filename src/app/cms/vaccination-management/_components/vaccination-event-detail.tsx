"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Calendar, MapPin, ArrowLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

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

interface EventDetail {
  event_id: string;
  title: string;
  vaccination_date: string;
  vaccination_time: string;
  location?: string;
  classes: ClassDetail[];
}

export default function VaccinationEventDetail({
  eventId,
}: {
  eventId: string;
}) {
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchEventDetail();
  }, [eventId]);

  const fetchEventDetail = async () => {
    try {
      const response = await fetch(
        `/api/vaccination-schedules/events/${eventId}`
      );
      const data = await response.json();
      setEventDetail(data);
    } catch (error) {
      setEventDetail(null);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClassDetail = (classId: string) => {
    router.push(
      `/cms/vaccination-management/events/${eventId}/classes/${classId}`
    );
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!eventDetail) return <div>Không tìm thấy thông tin sự kiện</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold">Chi tiết sự kiện tiêm chủng</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{eventDetail.title}</CardTitle>
          <div className="flex gap-4 text-gray-600 mt-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {eventDetail.vaccination_date}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {eventDetail.location}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lớp</TableHead>
                <TableHead>Khối</TableHead>
                <TableHead>Tổng học sinh</TableHead>
                <TableHead>Đã đồng ý</TableHead>
                <TableHead>Đang chờ</TableHead>
                <TableHead>Đã từ chối</TableHead>
                <TableHead>Đã tiêm</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventDetail.classes.map((cls) => (
                <TableRow
                  key={cls.class_id}
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => handleViewClassDetail(cls.class_id)}
                >
                  <TableCell>{cls.class_name}</TableCell>
                  <TableCell>{cls.grade_level}</TableCell>
                  <TableCell>{cls.total_students}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">
                      {cls.approved_count}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {cls.pending_count}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-red-100 text-red-800">
                      {cls.rejected_count}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800">
                      {cls.completed_count}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="w-4 h-4" />
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

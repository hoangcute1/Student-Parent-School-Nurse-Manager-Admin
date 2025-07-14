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
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Student {
  vaccination_id: string;
  student: {
    _id: string;
    full_name: string;
    student_id: string;
    email?: string;
    phone?: string;
  };
  status: string;
  parent_response_notes?: string;
  rejection_reason?: string;
}

interface ClassDetail {
  class_id: string;
  class_name: string;
  students: Student[];
}

export default function VaccinationClassDetail({
  eventId,
  classId,
}: {
  eventId: string;
  classId: string;
}) {
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchClassDetail();
  }, [eventId, classId]);

  const fetchClassDetail = async () => {
    try {
      const response = await fetch(
        `/api/vaccination-schedules/events/${eventId}/classes/${classId}`
      );
      const data = await response.json();
      setClassDetail(data);
    } catch (error) {
      setClassDetail(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!classDetail) return <div>Không tìm thấy thông tin lớp</div>;

  // Lọc chỉ học sinh đã đồng ý
  const approvedStudents = classDetail.students.filter(
    (s) => s.status === "Approved"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold">
          Danh sách học sinh đồng ý tiêm chủng
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{classDetail.class_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã học sinh</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Điện thoại</TableHead>
                <TableHead>Ghi chú PH</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvedStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Chưa có học sinh nào đồng ý
                  </TableCell>
                </TableRow>
              ) : (
                approvedStudents.map((student) => (
                  <TableRow key={student.vaccination_id}>
                    <TableCell>{student.student.student_id}</TableCell>
                    <TableCell>{student.student.full_name}</TableCell>
                    <TableCell>{student.student.email || "-"}</TableCell>
                    <TableCell>{student.student.phone || "-"}</TableCell>
                    <TableCell>
                      {student.parent_response_notes || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

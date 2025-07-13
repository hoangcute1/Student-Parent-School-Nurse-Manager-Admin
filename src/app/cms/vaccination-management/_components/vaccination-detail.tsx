"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  AlertTriangle,
  Syringe,
  User,
  FileText,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { useVaccinationStore } from "@/stores/vaccination-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VaccinationDetailProps {
  eventId: string;
  onClose: () => void;
}

export function VaccinationDetail({
  eventId,
  onClose,
}: VaccinationDetailProps) {
  const { events, loading, error } = useVaccinationStore();
  const [event, setEvent] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState<any>(null); // Lưu lớp đang chọn để xem danh sách học sinh
  // Thêm state để xác định chế độ: true = xem danh sách lớp, false = xem chi tiết
  const [showClassList, setShowClassList] = useState<boolean>(false);

  useEffect(() => {
    const foundEvent = events.find((e) => String(e._id) === String(eventId));
    setEvent(foundEvent || null);
    setSelectedClass(null); // Reset khi đổi event
    // Nếu eventId thay đổi, mặc định là xem chi tiết (không phải xem danh sách lớp)
    setShowClassList(false);
  }, [eventId, events]);

  // Cho phép bên ngoài gọi chuyển sang chế độ xem danh sách lớp
  // Nếu muốn showClassList = true khi mở từ onViewClasses, có thể truyền prop hoặc dùng eventId đặc biệt

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center text-red-500">
            {error || "Không tìm thấy thông tin sự kiện"}
          </div>
          <Button onClick={onClose} className="mt-4">
            Đóng
          </Button>
        </div>
      </div>
    );
  }

  // Nếu đã chọn lớp, hiển thị danh sách học sinh đồng ý tiêm
  if (selectedClass) {
    // Lọc học sinh đã đồng ý
    const approvedStudents = (selectedClass.students || []).filter(
      (s: any) => s.status === "Approved"
    );
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedClass(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  Danh sách học sinh đồng ý tiêm - {selectedClass.class_name}
                </CardTitle>
              </div>
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </CardHeader>
          <div className="p-6 overflow-y-auto">
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
                  approvedStudents.map((student: any) => (
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
          </div>
        </div>
      </div>
    );
  }

  // Nếu ở chế độ xem danh sách lớp
  if (showClassList) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Syringe className="w-5 h-5" />
                Danh sách lớp tham gia
              </CardTitle>
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </CardHeader>
          <div className="p-6 overflow-y-auto space-y-6">
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Tổng học sinh</TableHead>
                    <TableHead>Đã đồng ý</TableHead>
                    <TableHead>Đang chờ</TableHead>
                    <TableHead>Đã từ chối</TableHead>
                    <TableHead>Đã tiêm</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(event.classes || []).map((cls: any) => (
                    <TableRow
                      key={cls.class_id}
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => setSelectedClass(cls)}
                    >
                      <TableCell>{cls.class_name}</TableCell>
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Nếu ở chế độ xem chi tiết (mặc định)
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Syringe className="w-5 h-5" />
              Chi tiết sự kiện tiêm chủng
            </CardTitle>
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </CardHeader>
        <div className="p-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Tiêu đề:</span>
              <span className="text-gray-700">{event.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <Syringe className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Loại vắc xin:</span>
              <span className="text-gray-700">
                {event.vaccine_type || "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Khối lớp:</span>
              <span className="text-gray-700">
                {event.grade_levels.length > 0
                  ? `Khối ${event.grade_levels.join(", ")}`
                  : "Cá nhân"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Ngày tiêm:</span>
              <span className="text-gray-700">
                {new Date(event.vaccination_date).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Giờ tiêm:</span>
              <span className="text-gray-700">{event.vaccination_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Địa điểm:</span>
              <span className="text-gray-700">
                {event.location || "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Bác sĩ phụ trách:</span>
              <span className="text-gray-700">
                {event.doctor_name || "Chưa phân công"}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Ghi chú & Hướng dẫn:</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {event.description || "Chưa có mô tả hoặc hướng dẫn"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

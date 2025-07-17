"use client";

import { getParentId } from "@/lib/utils/parent-utils";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  Stethoscope,
  Bell,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { fetchData } from "@/lib/api/api";
import { createNotification } from "@/lib/api/notification";
import { getStudentById } from "@/lib/api/student";
import { useRouter } from "next/navigation";

// Hàm lấy parentId từ studentId
async function fetchParentIdByStudentId(
  studentId: string
): Promise<string | null> {
  try {
    const res = await fetchData<any>(`/students/${studentId}`);
    if (res && res.parent) {
      return typeof res.parent === "string" ? res.parent : res.parent._id;
    }
    return null;
  } catch (err) {
    console.error("Không lấy được parentId từ studentId:", err);
    return null;
  }
}

interface Student {
  examination_id: string;
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
  health_result?: string;
  recommendations?: string;
  follow_up_required?: boolean;
  examination_notes?: string;
  created_at: string;
  updated_at: string;
  consultation_date?: string; // Thêm trường consultation_date
  is_consultation?: boolean; // Thêm trường is_consultation
}

interface ClassDetail {
  event_id: string;
  class_id: string;
  class_info: {
    name: string;
    grade_level: number;
    teacher?: string;
  };
  event_details: {
    title: string;
    examination_date: string;
    examination_time: string;
    location: string;
    examination_type: string;
  };
  statistics: {
    total_students: number;
    approved: number;
    pending: number;
    rejected: number;
    completed: number;
  };
  students: Student[];
}

interface Props {
  eventId: string;
  classId: string;
}

export default function HealthExaminationClassDetail({
  eventId,
  classId,
}: Props) {
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] =
    useState(false);
  const [consultationStatus, setConsultationStatus] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();

  // Form state for health examination result
  const [healthResult, setHealthResult] = useState("");
  const [examinationNotes, setExaminationNotes] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [updating, setUpdating] = useState(false);
  // Form state for consultation scheduling
  const [consultationTitle, setConsultationTitle] = useState("");
  const [consultationDate, setConsultationDate] = useState<Date | undefined>(
    undefined
  );
  const [consultationTime, setConsultationTime] = useState("");
  const [consultationDoctor, setConsultationDoctor] = useState("");
  const [consultationNotes, setConsultationNotes] = useState("");
  const [schedulingConsultation, setSchedulingConsultation] = useState(false);

  // Form state for different examination types
  // Khám sức khỏe định kỳ
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [vision, setVision] = useState("");
  const [healthStatus, setHealthStatus] = useState("");

  // Khám răng miệng
  const [milkTeeth, setMilkTeeth] = useState("");
  const [permanentTeeth, setPermanentTeeth] = useState("");
  const [cavities, setCavities] = useState("");
  const [dentalStatus, setDentalStatus] = useState("");

  // Khám mắt
  const [rightEyeVision, setRightEyeVision] = useState("");
  const [leftEyeVision, setLeftEyeVision] = useState("");
  const [eyePressure, setEyePressure] = useState("");
  const [eyeStatus, setEyeStatus] = useState("");

  useEffect(() => {
    fetchClassDetail();
  }, [eventId, classId]);

  // Calculate BMI automatically
  useEffect(() => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);

      if (heightInMeters > 0 && weightInKg > 0) {
        const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
        setBmi(calculatedBMI.toFixed(1));
      }
    }
  }, [height, weight]);

  const fetchClassDetail = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors

      console.log("Fetching class detail for:", { eventId, classId });

      const response = await fetchData<any>(
        `/health-examinations/events/${eventId}/classes/${classId}`
      );

      if (!response) {
        throw new Error("Không nhận được dữ liệu từ server");
      }

      console.log("Class detail received:", response);
      setClassDetail(response);
    } catch (err) {
      console.error("Error fetching class detail:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(`Không thể lấy chi tiết lớp học: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to check if student has consultation scheduled
  const hasConsultationScheduled = (student: Student) => {
    // Check if student has follow_up_required set to true (from backend)
    if (student.follow_up_required === true) {
      return true;
    }

    // Check if student has consultation in examination_notes or recommendations
    const hasConsultationNote =
      student.examination_notes?.toLowerCase().includes("tư vấn") ||
      student.examination_notes?.toLowerCase().includes("consultation") ||
      student.recommendations?.toLowerCase().includes("tư vấn") ||
      student.recommendations?.toLowerCase().includes("consultation");

    // Check if we have manually set consultation status for this student
    const manualConsultationStatus = consultationStatus[student.student._id];

    return hasConsultationNote || manualConsultationStatus;
  };

  // Thêm hàm kiểm tra học sinh đã có lịch hẹn tư vấn cho ngày này chưa
  const hasConsultationForDate = (student: Student, date: Date | undefined) => {
    if (!classDetail || !date) return false;
    // Giả sử bạn có thể lấy danh sách lịch hẹn tư vấn từ classDetail.students hoặc từ API khác
    // Ở đây kiểm tra theo student_id và consultation_date (so sánh ngày, không so sánh giờ)
    return classDetail.students.some(
      (s) =>
        s.student._id === student.student._id &&
        s.consultation_date &&
        new Date(s.consultation_date).toDateString() === date.toDateString() &&
        s.is_consultation
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-500">Đã đồng ý</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500">Đang chờ</Badge>;
      case "Rejected":
        return <Badge className="bg-red-500">Từ chối</Badge>;
      case "Completed":
        return <Badge className="bg-blue-500">Đã khám</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Rejected":
        return <UserX className="h-4 w-4 text-red-500" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const openResultDialog = (student: Student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  const closeResultDialog = () => {
    setSelectedStudent(null);
    setIsDialogOpen(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!classDetail) {
    return (
      <Card>
        <CardContent className="p-6">
          <div>Không tìm thấy thông tin lớp học</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleGoBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-2xl">
                Chi tiết lớp {classDetail.class_info.name}
              </CardTitle>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <div>
              <strong>Sự kiện:</strong> {classDetail.event_details.title}
            </div>
            <div>
              <strong>Ngày khám:</strong>{" "}
              {format(
                new Date(classDetail.event_details.examination_date),
                "dd/MM/yyyy",
                { locale: vi }
              )}
            </div>
            <div>
              <strong>Giờ khám:</strong>{" "}
              {classDetail.event_details.examination_time}
            </div>
            <div>
              <strong>Địa điểm:</strong> {classDetail.event_details.location}
            </div>
            <div>
              <strong>Loại khám:</strong>{" "}
              {classDetail.event_details.examination_type}
            </div>
            {classDetail.class_info.teacher && (
              <div>
                <strong>Giáo viên chủ nhiệm:</strong>{" "}
                {classDetail.class_info.teacher}
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách học sinh đã đồng ý khám</CardTitle>
          <div className="text-sm text-gray-600">
            Hiển thị học sinh đã được phụ huynh đồng ý khám sức khỏe (bao gồm cả
            đã khám xong)
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {classDetail.students.filter(
              (student) =>
                student.status === "Approved" || student.status === "Completed"
            ).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-lg font-medium">
                  Chưa có học sinh đồng ý khám
                </div>
                <div className="text-sm mt-2">
                  Học sinh sẽ hiển thị ở đây sau khi phụ huynh đồng ý khám sức
                  khỏe
                </div>
                <div className="text-sm mt-2 text-blue-600">
                  Thống kê chi tiết:
                  <div className="mt-1">
                    <span className="inline-block mx-2">
                      Đã đồng ý: {classDetail.statistics.approved}
                    </span>
                    <span className="inline-block mx-2">
                      Đã hoàn thành: {classDetail.statistics.completed}
                    </span>
                    <span className="inline-block mx-2">
                      Chờ phản hồi: {classDetail.statistics.pending}
                    </span>
                    <span className="inline-block mx-2">
                      Từ chối: {classDetail.statistics.rejected}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              classDetail.students
                .filter(
                  (student) =>
                    student.status === "Approved" ||
                    student.status === "Completed"
                )
                .map((student) => (
                  <div
                    key={student.examination_id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(student.status)}
                      <div>
                        <div className="font-medium">
                          {student.student?.full_name ||
                            (student.student as any)?.name ||
                            (student as any).full_name ||
                            (student as any).name ||
                            "Không xác định"}
                        </div>
                        <div className="text-sm text-gray-600">
                          MSSV:{" "}
                          {student.student?.student_id ||
                            (student.student as any)?.studentId ||
                            (student.student as any)?.id ||
                            (student as any).student_id ||
                            (student as any).studentId ||
                            (student as any).id ||
                            "Không xác định"}
                        </div>
                        {student.health_result && (
                          <div className="text-sm text-blue-600">
                            {(() => {
                              try {
                                const parsedResult = JSON.parse(
                                  student.health_result
                                );
                                return `Trạng thái: ${
                                  parsedResult.status || "Đã khám"
                                }`;
                              } catch {
                                return `Kết quả: ${
                                  student.health_result.length > 50
                                    ? student.health_result.substring(0, 50) +
                                      "..."
                                    : student.health_result
                                }`;
                              }
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(student.status)}

                      {/* Nút Xem kết quả */}
                      <Button
                        size="sm"
                        onClick={() => openResultDialog(student)}
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Xem kết quả</span>
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Result Dialog - Read Only */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kết quả khám sức khỏe</DialogTitle>
          </DialogHeader>

          {selectedStudent && classDetail && (
            <div className="space-y-4">
              <div>
                <strong>Học sinh:</strong>{" "}
                {selectedStudent.student?.full_name ||
                  (selectedStudent.student as any)?.name ||
                  (selectedStudent as any).full_name ||
                  (selectedStudent as any).name ||
                  "Không xác định"}{" "}
                (MSSV:{" "}
                {selectedStudent.student?.student_id ||
                  (selectedStudent.student as any)?.studentId ||
                  (selectedStudent.student as any)?.id ||
                  (selectedStudent as any).student_id ||
                  (selectedStudent as any).studentId ||
                  (selectedStudent as any).id ||
                  "Không xác định"}
                )
              </div>

              {/* Display health result based on examination type */}
              {selectedStudent.health_result &&
                (() => {
                  try {
                    const parsedResult = JSON.parse(
                      selectedStudent.health_result
                    );

                    if (parsedResult.type === "Khám sức khỏe định kỳ") {
                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Chiều cao (cm)</Label>
                              <Input
                                value={parsedResult.height || ""}
                                disabled
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Cân nặng (kg)</Label>
                              <Input
                                value={parsedResult.weight || ""}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Chỉ số BMI</Label>
                              <Input value={parsedResult.bmi || ""} disabled />
                            </div>
                            <div className="space-y-2">
                              <Label>Thị lực</Label>
                              <Input
                                value={parsedResult.vision || ""}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Trạng thái sức khỏe</Label>
                            <Input value={parsedResult.status || ""} disabled />
                          </div>
                        </div>
                      );
                    } else if (parsedResult.type === "Khám răng miệng") {
                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Số răng sữa</Label>
                              <Input
                                value={parsedResult.milk_teeth || ""}
                                disabled
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Số răng vĩnh viễn</Label>
                              <Input
                                value={parsedResult.permanent_teeth || ""}
                                disabled
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Số răng sâu</Label>
                              <Input
                                value={parsedResult.cavities || ""}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Trạng thái răng miệng</Label>
                            <Input value={parsedResult.status || ""} disabled />
                          </div>
                        </div>
                      );
                    } else if (parsedResult.type === "Khám mắt") {
                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Thị lực mắt phải</Label>
                              <Input
                                value={parsedResult.right_eye_vision || ""}
                                disabled
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Thị lực mắt trái</Label>
                              <Input
                                value={parsedResult.left_eye_vision || ""}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Trạng thái mắt</Label>
                            <Input value={parsedResult.status || ""} disabled />
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="space-y-2">
                          <Label>Kết quả khám</Label>
                          <Textarea
                            value={selectedStudent.health_result}
                            disabled
                            rows={4}
                          />
                        </div>
                      );
                    }
                  } catch (error) {
                    return (
                      <div className="space-y-2">
                        <Label>Kết quả khám</Label>
                        <Textarea
                          value={selectedStudent.health_result}
                          disabled
                          rows={4}
                        />
                      </div>
                    );
                  }
                })()}

              {/* Examination Notes */}
              {selectedStudent.examination_notes && (
                <div className="space-y-2">
                  <Label>Ghi chú khám</Label>
                  <Textarea
                    value={selectedStudent.examination_notes}
                    disabled
                    rows={3}
                  />
                </div>
              )}

              {/* Recommendations */}
              {selectedStudent.recommendations && (
                <div className="space-y-2">
                  <Label>Khuyến nghị</Label>
                  <Textarea
                    value={selectedStudent.recommendations}
                    disabled
                    rows={3}
                  />
                </div>
              )}

              {/* Follow up required */}
              {selectedStudent.follow_up_required && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-yellow-800">
                    <strong>Cần tư vấn thêm</strong>
                    <div className="text-sm mt-1">
                      Học sinh này cần được tư vấn thêm.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeResultDialog}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

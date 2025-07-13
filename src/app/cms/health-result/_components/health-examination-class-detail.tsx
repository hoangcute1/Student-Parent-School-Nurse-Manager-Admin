"use client";

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
import { useRouter } from "next/navigation";

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

  // Form state for health examination result
  const [healthResult, setHealthResult] = useState("");
  const [examinationNotes, setExaminationNotes] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
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
      const response = await fetch(
        `/api/health-examinations/events/${encodeURIComponent(
          eventId
        )}/classes/${classId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch class detail");
      }

      const data = await response.json();
      setClassDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
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
    setHealthResult(student.health_result || "");
    setExaminationNotes(student.examination_notes || "");
    setRecommendations(student.recommendations || "");

    // Reset all examination form fields
    setHeight("");
    setWeight("");
    setBmi("");
    setVision("");
    setHealthStatus("");
    setMilkTeeth("");
    setPermanentTeeth("");
    setCavities("");
    setDentalStatus("");
    setRightEyeVision("");
    setLeftEyeVision("");
    setEyePressure("");
    setEyeStatus("");

    // Parse and populate existing results if available
    if (student.health_result) {
      try {
        const parsedResult = JSON.parse(student.health_result);
        if (parsedResult.type === "Khám sức khỏe định kỳ") {
          setHeight(parsedResult.height || "");
          setWeight(parsedResult.weight || "");
          setBmi(parsedResult.bmi || "");
          setVision(parsedResult.vision || "");
          setHealthStatus(parsedResult.status || "");
        } else if (parsedResult.type === "Khám răng miệng") {
          setMilkTeeth(parsedResult.milk_teeth || "");
          setPermanentTeeth(parsedResult.permanent_teeth || "");
          setCavities(parsedResult.cavities || "");
          setDentalStatus(parsedResult.status || "");
        } else if (parsedResult.type === "Khám mắt") {
          setRightEyeVision(parsedResult.right_eye_vision || "");
          setLeftEyeVision(parsedResult.left_eye_vision || "");
          setEyePressure(parsedResult.eye_pressure || "");
          setEyeStatus(parsedResult.status || "");
        }
      } catch (error) {
        console.error("Error parsing existing health result:", error);
      }
    }

    setIsDialogOpen(true);
  };

  const openConsultationDialog = (student: Student) => {
    setSelectedStudent(student);
    setConsultationDate(undefined);
    setConsultationTime("");
    setConsultationNotes("");
    setIsConsultationDialogOpen(true);
  };

  const handleExamination = (student: Student) => {
    // Handle examination action
    openResultDialog(student);
  };

  const handleViewResult = (student: Student) => {
    // Handle view result action
    openResultDialog(student);
  };

  const closeResultDialog = () => {
    setSelectedStudent(null);
    setHealthResult("");
    setExaminationNotes("");
    setRecommendations("");

    // Reset all examination form fields
    setHeight("");
    setWeight("");
    setBmi("");
    setVision("");
    setHealthStatus("");
    setMilkTeeth("");
    setPermanentTeeth("");
    setCavities("");
    setDentalStatus("");
    setRightEyeVision("");
    setLeftEyeVision("");
    setEyePressure("");
    setEyeStatus("");

    setIsDialogOpen(false);
  };

  const closeConsultationDialog = () => {
    setIsConsultationDialogOpen(false);
    setSelectedStudent(null);
    setConsultationTitle("");
    setConsultationDate(undefined);
    setConsultationTime("");
    setConsultationDoctor("");
    setConsultationNotes("");
  };
  const handleGoBack = () => {
    router.back();
  };
  const handleScheduleConsultation = async () => {
    if (
      !selectedStudent ||
      !consultationTitle ||
      !consultationDate ||
      !consultationTime ||
      !consultationDoctor
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setSchedulingConsultation(true);
    try {
      const response = await fetch(
        `/api/health-examinations/schedule-consultation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: selectedStudent.student._id,
            title: consultationTitle,
            consultation_date: consultationDate.toISOString(),
            consultation_time: consultationTime,
            doctor: consultationDoctor,
            notes: consultationNotes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể lập lịch hẹn tư vấn");
      }

      alert("Lập lịch hẹn tư vấn thành công!");
      closeConsultationDialog();
    } catch (error) {
      console.error("Error scheduling consultation:", error);
      alert("Có lỗi xảy ra khi lập lịch hẹn tư vấn");
    } finally {
      setSchedulingConsultation(false);
    }
  };

  const handleUpdateResult = async () => {
    if (!selectedStudent || !classDetail) return;

    // Validation based on examination type
    let validationErrors = [];

    const examType =
      classDetail.event_details.examination_type?.toLowerCase() || "";

    if (
      examType.includes("khám sức khỏe định kỳ") ||
      examType.includes("kham suc khoe dinh ky") ||
      examType.includes("periodic health") ||
      examType === "" ||
      !classDetail.event_details.examination_type
    ) {
      if (!height) validationErrors.push("Chiều cao");
      if (!weight) validationErrors.push("Cân nặng");
      if (!vision) validationErrors.push("Thị lực");
      if (!healthStatus) validationErrors.push("Trạng thái sức khỏe");
    } else if (
      examType.includes("khám răng miệng") ||
      examType.includes("kham rang mieng") ||
      examType.includes("khám răng") ||
      examType.includes("dental examination") ||
      examType.includes("dental")
    ) {
      if (!milkTeeth && milkTeeth !== "0") validationErrors.push("Số răng sữa");
      if (!permanentTeeth && permanentTeeth !== "0")
        validationErrors.push("Số răng vĩnh viễn");
      if (!cavities && cavities !== "0") validationErrors.push("Số răng sâu");
      if (!dentalStatus) validationErrors.push("Trạng thái răng miệng");
    } else if (
      examType.includes("khám mắt") ||
      examType.includes("kham mat") ||
      examType.includes("eye examination") ||
      examType.includes("eye")
    ) {
      if (!rightEyeVision) validationErrors.push("Thị lực mắt phải");
      if (!leftEyeVision) validationErrors.push("Thị lực mắt trái");
      if (!eyeStatus) validationErrors.push("Trạng thái mắt");
    }

    if (validationErrors.length > 0) {
      alert(`Vui lòng điền đầy đủ thông tin: ${validationErrors.join(", ")}`);
      return;
    }

    try {
      setUpdating(true);

      // Prepare data based on examination type
      let examinationData: any = {
        examination_notes: examinationNotes,
        recommendations: recommendations,
      };

      // Add specific fields based on examination type
      const examType =
        classDetail.event_details.examination_type?.toLowerCase() || "";

      if (
        examType.includes("khám sức khỏe định kỳ") ||
        examType.includes("kham suc khoe dinh ky") ||
        examType.includes("periodic health") ||
        examType === "" ||
        !classDetail.event_details.examination_type
      ) {
        examinationData.health_result = JSON.stringify({
          height,
          weight,
          bmi,
          vision,
          status: healthStatus,
          type: "Khám sức khỏe định kỳ",
        });
      } else if (
        examType.includes("khám răng miệng") ||
        examType.includes("kham rang mieng") ||
        examType.includes("khám răng") ||
        examType.includes("dental examination") ||
        examType.includes("dental")
      ) {
        examinationData.health_result = JSON.stringify({
          milk_teeth: milkTeeth,
          permanent_teeth: permanentTeeth,
          cavities,
          status: dentalStatus,
          type: "Khám răng miệng",
        });
      } else if (
        examType.includes("khám mắt") ||
        examType.includes("kham mat") ||
        examType.includes("eye examination") ||
        examType.includes("eye")
      ) {
        examinationData.health_result = JSON.stringify({
          right_eye_vision: rightEyeVision,
          left_eye_vision: leftEyeVision,
          eye_pressure: eyePressure,
          status: eyeStatus,
          type: "Khám mắt",
        });
      }

      const response = await fetch(
        `/api/health-examinations/${selectedStudent.examination_id}/result`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(examinationData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update examination result");
      }

      // Refresh the class detail to show updated data
      await fetchClassDetail();
      closeResultDialog();
    } catch (err) {
      console.error("Error updating examination result:", err);
      // You could show an error toast here
    } finally {
      setUpdating(false);
    }
  };

  const handleVaccinate = (student: Student) => {
    alert(
      `Tiêm cho học sinh: ${student.student?.full_name || student.student?._id}`
    );
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
      {/* Header */}
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
          <CardTitle className="text-2xl">
            Chi tiết lớp {classDetail.class_info.name}
          </CardTitle>
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
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // Navigate to event details or show event detail modal
              alert("Xem chi tiết sự kiện khám - Chức năng sẽ được phát triển");
            }}
          >
            📋 Xem chi tiết sự kiện khám
          </Button>
        </CardContent>
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

                      {/* Nút Tiêm */}
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleVaccinate(student)}
                        className={`flex items-center space-x-1 ${
                          student.status === "Completed"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={student.status === "Completed"}
                      >
                        💉
                        <span>
                          {student.status === "Completed" ? "Đã tiêm" : "Tiêm"}
                        </span>
                      </Button>

                      {/* Nút Khám */}
                      <Button
                        size="sm"
                        onClick={() => handleExamination(student)}
                        variant="default"
                        className={`flex items-center space-x-1 ${
                          student.status === "Completed"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={student.status === "Completed"}
                      >
                        <Stethoscope className="h-4 w-4" />
                        <span>
                          {student.status === "Completed" ? "Đã khám" : "Khám"}
                        </span>
                      </Button>

                      {/* Nút Chuông (Lập lịch hẹn tư vấn) */}
                      <Button
                        size="sm"
                        onClick={() => openConsultationDialog(student)}
                        variant="outline"
                        className="flex items-center space-x-1"
                      >
                        <Bell className="h-4 w-4" />
                        <span>Lập lịch hẹn tư vấn</span>
                      </Button>

                      {/* Nút Xem kết quả */}
                      <Button
                        size="sm"
                        onClick={() => handleViewResult(student)}
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

      {/* Result Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedStudent?.status === "Completed"
                ? `Kết quả ${
                    classDetail.event_details.examination_type ||
                    "khám sức khỏe"
                  }`
                : `Ghi nhận kết quả ${
                    classDetail.event_details.examination_type ||
                    "khám sức khỏe"
                  }`}
            </DialogTitle>
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
                  (selectedStudent as any)?.id ||
                  (selectedStudent as any).student_id ||
                  (selectedStudent as any).studentId ||
                  (selectedStudent as any).id ||
                  "Không xác định"}
                )
              </div>

              {/* Form fields based on examination type */}
              {(() => {
                const examType =
                  classDetail.event_details.examination_type?.toLowerCase() ||
                  "";
                const isPeriodicHealth =
                  examType.includes("khám sức khỏe định kỳ") ||
                  examType.includes("kham suc khoe dinh ky") ||
                  examType.includes("periodic health") ||
                  examType === "" ||
                  !classDetail.event_details.examination_type;

                console.log("Debug - examType:", examType);
                console.log("Debug - isPeriodicHealth:", isPeriodicHealth);

                return isPeriodicHealth;
              })() && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Chiều cao (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="VD: 120"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        disabled={selectedStudent.status === "Completed"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Cân nặng (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="VD: 25"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        disabled={selectedStudent.status === "Completed"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bmi">Chỉ số BMI</Label>
                      <Input
                        id="bmi"
                        value={bmi}
                        disabled
                        placeholder="Tự động tính"
                        className="bg-gray-50"
                      />
                      {bmi && (
                        <div className="text-xs text-gray-600">
                          {parseFloat(bmi) < 18.5 && "Dưới mức tiêu chuẩn"}
                          {parseFloat(bmi) >= 18.5 &&
                            parseFloat(bmi) < 24.9 &&
                            "Bình thường"}
                          {parseFloat(bmi) >= 25 &&
                            parseFloat(bmi) < 29.9 &&
                            "Thừa cân"}
                          {parseFloat(bmi) >= 30 && "Béo phì"}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vision">Thị lực</Label>
                      <Input
                        id="vision"
                        placeholder="VD: 10/10"
                        value={vision}
                        onChange={(e) => setVision(e.target.value)}
                        disabled={selectedStudent.status === "Completed"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="health_status">Trạng thái sức khỏe</Label>
                    <select
                      id="health_status"
                      value={healthStatus}
                      onChange={(e) => setHealthStatus(e.target.value)}
                      disabled={selectedStudent.status === "Completed"}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Chọn trạng thái</option>
                      <option value="Bình thường">Bình thường</option>
                      <option value="Cần theo dõi">Cần theo dõi</option>
                      <option value="Cần tư vấn thêm">Cần tư vấn thêm</option>
                      <option value="Cần điều trị">Cần điều trị</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="examination_notes">Ghi chú</Label>
                    <Textarea
                      id="examination_notes"
                      placeholder="Nhập ghi chú khám sức khỏe định kỳ..."
                      value={examinationNotes}
                      onChange={(e) => setExaminationNotes(e.target.value)}
                      disabled={selectedStudent.status === "Completed"}
                    />
                  </div>
                </div>
              )}

              {(() => {
                const examType =
                  classDetail.event_details.examination_type?.toLowerCase() ||
                  "";
                const isDental =
                  examType.includes("khám răng miệng") ||
                  examType.includes("kham rang mieng") ||
                  examType.includes("khám răng") ||
                  examType.includes("dental examination") ||
                  examType.includes("dental");

                console.log("Debug - examType:", examType);
                console.log("Debug - isDental:", isDental);

                return isDental;
              })() && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="milk_teeth">Số răng sữa</Label>
                      <Input
                        id="milk_teeth"
                        type="number"
                        placeholder="VD: 18"
                        value={milkTeeth}
                        onChange={(e) => setMilkTeeth(e.target.value)}
                        disabled={selectedStudent.status === "Completed"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="permanent_teeth">Số răng vĩnh viễn</Label>
                      <Input
                        id="permanent_teeth"
                        type="number"
                        placeholder="VD: 2"
                        value={permanentTeeth}
                        onChange={(e) => setPermanentTeeth(e.target.value)}
                        disabled={selectedStudent.status === "Completed"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cavities">Số răng sâu</Label>
                      <Input
                        id="cavities"
                        type="number"
                        placeholder="VD: 1"
                        value={cavities}
                        onChange={(e) => setCavities(e.target.value)}
                        disabled={selectedStudent.status === "Completed"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dental_status">Trạng thái răng miệng</Label>
                    <select
                      id="dental_status"
                      value={dentalStatus}
                      onChange={(e) => setDentalStatus(e.target.value)}
                      disabled={selectedStudent.status === "Completed"}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Chọn trạng thái</option>
                      <option value="Bình thường">Bình thường</option>
                      <option value="Cần theo dõi">Cần theo dõi</option>
                      <option value="Cần điều trị sâu răng">
                        Cần điều trị sâu răng
                      </option>
                      <option value="Cần vệ sinh răng miệng">
                        Cần vệ sinh răng miệng
                      </option>
                      <option value="Cần tư vấn nha khoa">
                        Cần tư vấn nha khoa
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="examination_notes">Ghi chú</Label>
                    <Textarea
                      id="examination_notes"
                      placeholder="Nhập ghi chú khám răng miệng..."
                      value={examinationNotes}
                      onChange={(e) => setExaminationNotes(e.target.value)}
                      disabled={selectedStudent.status === "Completed"}
                    />
                  </div>
                </div>
              )}

              {(() => {
                const examType =
                  classDetail.event_details.examination_type?.toLowerCase() ||
                  "";
                const isEye =
                  examType.includes("khám mắt") ||
                  examType.includes("kham mat") ||
                  examType.includes("eye examination") ||
                  examType.includes("eye");

                console.log("Debug - examType:", examType);
                console.log("Debug - isEye:", isEye);

                return isEye;
              })() && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="right_eye_vision">
                        Thị lực mắt phải (.../10)
                      </Label>
                      <Input
                        id="right_eye_vision"
                        placeholder="VD: 10/10 hoặc 8/10"
                        value={rightEyeVision}
                        onChange={(e) => setRightEyeVision(e.target.value)}
                        disabled={selectedStudent.status === "Completed"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="left_eye_vision">
                        Thị lực mắt trái (.../10)
                      </Label>
                      <Input
                        id="left_eye_vision"
                        placeholder="VD: 10/10 hoặc 9/10"
                        value={leftEyeVision}
                        onChange={(e) => setLeftEyeVision(e.target.value)}
                        disabled={selectedStudent.status === "Completed"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eye_status">Trạng thái mắt</Label>
                    <select
                      id="eye_status"
                      value={eyeStatus}
                      onChange={(e) => setEyeStatus(e.target.value)}
                      disabled={selectedStudent.status === "Completed"}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Chọn trạng thái</option>
                      <option value="Bình thường">Bình thường</option>
                      <option value="Cần theo dõi">Cần theo dõi</option>
                      <option value="Cận thị nhẹ">Cận thị nhẹ</option>
                      <option value="Cận thị nặng">Cận thị nặng</option>
                      <option value="Viễn thị">Viễn thị</option>
                      <option value="Loạn thị">Loạn thị</option>
                      <option value="Cần khám chuyên khoa">
                        Cần khám chuyên khoa
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="examination_notes">Ghi chú</Label>
                    <Textarea
                      id="examination_notes"
                      placeholder="Nhập ghi chú khám mắt..."
                      value={examinationNotes}
                      onChange={(e) => setExaminationNotes(e.target.value)}
                      disabled={selectedStudent.status === "Completed"}
                    />
                  </div>
                </div>
              )}

              {/* Fallback form if examination type doesn't match known types */}
              {(() => {
                const examType =
                  classDetail.event_details.examination_type?.toLowerCase() ||
                  "";
                const isPeriodicHealth =
                  examType.includes("khám sức khỏe định kỳ") ||
                  examType.includes("kham suc khoe dinh ky") ||
                  examType.includes("periodic health") ||
                  examType === "" ||
                  !classDetail.event_details.examination_type;

                const isDental =
                  examType.includes("khám răng miệng") ||
                  examType.includes("kham rang mieng") ||
                  examType.includes("khám răng") ||
                  examType.includes("dental examination") ||
                  examType.includes("dental");

                const isEye =
                  examType.includes("khám mắt") ||
                  examType.includes("kham mat") ||
                  examType.includes("eye examination") ||
                  examType.includes("eye");

                console.log("Debug - examType:", examType);
                console.log("Debug - isPeriodicHealth:", isPeriodicHealth);
                console.log("Debug - isDental:", isDental);
                console.log("Debug - isEye:", isEye);
                console.log(
                  "Debug - showFallback:",
                  !(isPeriodicHealth || isDental || isEye)
                );

                return !(isPeriodicHealth || isDental || isEye);
              })() && (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-yellow-800">
                      <strong>Loại khám không được hỗ trợ:</strong> "
                      {classDetail.event_details.examination_type}"
                    </div>
                    <div className="text-sm mt-2">
                      Vui lòng liên hệ admin để cập nhật form cho loại khám này.
                    </div>
                  </div>
                </div>
              )}

              {/* Common fields for all examination types */}
              <div className="space-y-2">
                <Label htmlFor="recommendations">Khuyến nghị</Label>
                <Textarea
                  id="recommendations"
                  placeholder="Nhập khuyến nghị cho học sinh và phụ huynh..."
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  disabled={selectedStudent.status === "Completed"}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeResultDialog}>
              {selectedStudent?.status === "Completed" ? "Đóng" : "Hủy"}
            </Button>
            {selectedStudent?.status !== "Completed" && (
              <Button onClick={handleUpdateResult} disabled={updating}>
                {updating ? "Đang lưu..." : "Lưu kết quả"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Consultation Dialog */}
      <Dialog
        open={isConsultationDialogOpen}
        onOpenChange={setIsConsultationDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lập lịch hẹn tư vấn</DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="consultation_title">Tiêu đề *</Label>
                <Input
                  id="consultation_title"
                  value={consultationTitle}
                  onChange={(e) => setConsultationTitle(e.target.value)}
                  placeholder="Ví dụ: Tư vấn về vấn đề sức khỏe"
                  required
                />
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày hẹn tư vấn *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !consultationDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {consultationDate
                          ? format(consultationDate, "dd/MM/yyyy", {
                              locale: vi,
                            })
                          : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={consultationDate}
                        onSelect={setConsultationDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultation_time">Giờ hẹn *</Label>
                  <Input
                    id="consultation_time"
                    type="time"
                    value={consultationTime}
                    onChange={(e) => setConsultationTime(e.target.value)}
                    placeholder="Chọn giờ hẹn"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultation_doctor">Bác sĩ hẹn *</Label>
                <Input
                  id="consultation_doctor"
                  value={consultationDoctor}
                  onChange={(e) => setConsultationDoctor(e.target.value)}
                  placeholder="Tên bác sĩ sẽ tư vấn"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultation_notes">Ghi chú</Label>
                <Textarea
                  id="consultation_notes"
                  placeholder="Nhập ghi chú cho buổi tư vấn..."
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeConsultationDialog}>
              Hủy
            </Button>
            <Button
              onClick={handleScheduleConsultation}
              disabled={schedulingConsultation}
            >
              {schedulingConsultation ? "Đang lưu..." : "Lập lịch hẹn"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

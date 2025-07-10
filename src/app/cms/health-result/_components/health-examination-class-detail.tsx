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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

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
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined);
  const [updating, setUpdating] = useState(false);

  // Form state for consultation scheduling
  const [consultationDate, setConsultationDate] = useState<Date | undefined>(
    undefined
  );
  const [consultationTime, setConsultationTime] = useState("");
  const [consultationNotes, setConsultationNotes] = useState("");
  const [schedulingConsultation, setSchedulingConsultation] = useState(false);

  // Form state for different examination types
  // Khám sức khỏe định kỳ
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [vision, setVision] = useState("");

  // Khám răng miệng
  const [milkTeeth, setMilkTeeth] = useState("");
  const [permanentTeeth, setPermanentTeeth] = useState("");
  const [cavities, setCavities] = useState("");

  // Khám mắt
  const [rightEyeVision, setRightEyeVision] = useState("");
  const [leftEyeVision, setLeftEyeVision] = useState("");
  const [eyePressure, setEyePressure] = useState("");

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
    setFollowUpRequired(student.follow_up_required || false);
    setFollowUpDate(undefined);

    // Reset all examination form fields
    setHeight("");
    setWeight("");
    setBmi("");
    setVision("");
    setMilkTeeth("");
    setPermanentTeeth("");
    setCavities("");
    setRightEyeVision("");
    setLeftEyeVision("");
    setEyePressure("");

    // Parse and populate existing results if available
    if (student.health_result) {
      try {
        const parsedResult = JSON.parse(student.health_result);
        if (parsedResult.type === "Khám sức khỏe định kỳ") {
          setHeight(parsedResult.height || "");
          setWeight(parsedResult.weight || "");
          setBmi(parsedResult.bmi || "");
          setVision(parsedResult.vision || "");
        } else if (parsedResult.type === "Khám răng miệng") {
          setMilkTeeth(parsedResult.milk_teeth || "");
          setPermanentTeeth(parsedResult.permanent_teeth || "");
          setCavities(parsedResult.cavities || "");
        } else if (parsedResult.type === "Khám mắt") {
          setRightEyeVision(parsedResult.right_eye_vision || "");
          setLeftEyeVision(parsedResult.left_eye_vision || "");
          setEyePressure(parsedResult.eye_pressure || "");
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
    setFollowUpRequired(false);
    setFollowUpDate(undefined);

    // Reset all examination form fields
    setHeight("");
    setWeight("");
    setBmi("");
    setVision("");
    setMilkTeeth("");
    setPermanentTeeth("");
    setCavities("");
    setRightEyeVision("");
    setLeftEyeVision("");
    setEyePressure("");

    setIsDialogOpen(false);
  };

  const closeConsultationDialog = () => {
    setIsConsultationDialogOpen(false);
    setSelectedStudent(null);
    setConsultationDate(undefined);
    setConsultationTime("");
    setConsultationNotes("");
  };

  const handleScheduleConsultation = async () => {
    if (!selectedStudent || !consultationDate || !consultationTime) {
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
            consultation_date: consultationDate.toISOString(),
            consultation_time: consultationTime,
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

    try {
      setUpdating(true);

      // Prepare data based on examination type
      let examinationData: any = {
        examination_notes: examinationNotes,
        recommendations: recommendations,
        follow_up_required: followUpRequired,
        follow_up_date: followUpDate?.toISOString(),
      };

      // Add specific fields based on examination type
      if (
        classDetail.event_details.examination_type === "Khám sức khỏe định kỳ"
      ) {
        examinationData.health_result = JSON.stringify({
          height,
          weight,
          bmi,
          vision,
          type: "Khám sức khỏe định kỳ",
        });
      } else if (
        classDetail.event_details.examination_type === "Khám răng miệng"
      ) {
        examinationData.health_result = JSON.stringify({
          milk_teeth: milkTeeth,
          permanent_teeth: permanentTeeth,
          cavities,
          type: "Khám răng miệng",
        });
      } else if (classDetail.event_details.examination_type === "Khám mắt") {
        examinationData.health_result = JSON.stringify({
          right_eye_vision: rightEyeVision,
          left_eye_vision: leftEyeVision,
          eye_pressure: eyePressure,
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
          <CardTitle>Danh sách học sinh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {classDetail.students.map((student) => (
              <div
                key={student.examination_id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(student.status)}
                  <div>
                    <div className="font-medium">
                      {student.student.full_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      MSSV: {student.student.student_id}
                    </div>
                    {student.health_result && (
                      <div className="text-sm text-blue-600">
                        Kết quả: {student.health_result}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(student.status)}

                  {/* Nút Khám */}
                  <Button
                    size="sm"
                    onClick={() => handleExamination(student)}
                    variant="default"
                    className="flex items-center space-x-1"
                  >
                    <Stethoscope className="h-4 w-4" />
                    <span>Khám</span>
                  </Button>

                  {/* Nút Chuông (Lập lịch hẹn tư vấn) */}
                  <Button
                    size="sm"
                    onClick={() => openConsultationDialog(student)}
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <Bell className="h-4 w-4" />
                    <span>Chuông</span>
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
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Result Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedStudent?.status === "Completed"
                ? "Kết quả khám sức khỏe"
                : "Ghi nhận kết quả khám"}
            </DialogTitle>
          </DialogHeader>

          {selectedStudent && classDetail && (
            <div className="space-y-4">
              <div>
                <strong>Học sinh:</strong> {selectedStudent.student.full_name}{" "}
                (MSSV: {selectedStudent.student.student_id})
              </div>
              <div>
                <strong>Loại khám:</strong>{" "}
                {classDetail.event_details.examination_type}
              </div>

              {/* Form fields based on examination type */}
              {classDetail.event_details.examination_type ===
                "Khám sức khỏe định kỳ" && (
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
                      <Label htmlFor="bmi">BMI</Label>
                      <Input
                        id="bmi"
                        value={bmi}
                        disabled
                        placeholder="Tự động tính"
                      />
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

              {classDetail.event_details.examination_type ===
                "Khám răng miệng" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="milk_teeth">Răng sữa</Label>
                      <Input
                        id="milk_teeth"
                        placeholder="VD: 18 răng"
                        value={milkTeeth}
                        onChange={(e) => setMilkTeeth(e.target.value)}
                        disabled={selectedStudent.status === "Completed"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="permanent_teeth">Răng vĩnh viễn</Label>
                      <Input
                        id="permanent_teeth"
                        placeholder="VD: 2 răng"
                        value={permanentTeeth}
                        onChange={(e) => setPermanentTeeth(e.target.value)}
                        disabled={selectedStudent.status === "Completed"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cavities">Răng sâu</Label>
                    <Input
                      id="cavities"
                      placeholder="VD: 1 răng"
                      value={cavities}
                      onChange={(e) => setCavities(e.target.value)}
                      disabled={selectedStudent.status === "Completed"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="examination_notes">Nội dung</Label>
                    <Textarea
                      id="examination_notes"
                      placeholder="Nhập nội dung khám răng miệng..."
                      value={examinationNotes}
                      onChange={(e) => setExaminationNotes(e.target.value)}
                      disabled={selectedStudent.status === "Completed"}
                    />
                  </div>
                </div>
              )}

              {classDetail.event_details.examination_type === "Khám mắt" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="right_eye_vision">Thị lực mắt phải</Label>
                      <Input
                        id="right_eye_vision"
                        placeholder="VD: 10/10"
                        value={rightEyeVision}
                        onChange={(e) => setRightEyeVision(e.target.value)}
                        disabled={selectedStudent.status === "Completed"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="left_eye_vision">Thị lực mắt trái</Label>
                      <Input
                        id="left_eye_vision"
                        placeholder="VD: 10/10"
                        value={leftEyeVision}
                        onChange={(e) => setLeftEyeVision(e.target.value)}
                        disabled={selectedStudent.status === "Completed"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eye_pressure">Nhãn áp</Label>
                    <Input
                      id="eye_pressure"
                      placeholder="VD: Bình thường"
                      value={eyePressure}
                      onChange={(e) => setEyePressure(e.target.value)}
                      disabled={selectedStudent.status === "Completed"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="examination_notes">Nội dung</Label>
                    <Textarea
                      id="examination_notes"
                      placeholder="Nhập nội dung khám mắt..."
                      value={examinationNotes}
                      onChange={(e) => setExaminationNotes(e.target.value)}
                      disabled={selectedStudent.status === "Completed"}
                    />
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="follow_up_required"
                  checked={followUpRequired}
                  onCheckedChange={(checked) =>
                    setFollowUpRequired(checked as boolean)
                  }
                  disabled={selectedStudent.status === "Completed"}
                />
                <Label htmlFor="follow_up_required">Cần tư vấn thêm</Label>
              </div>

              {followUpRequired && selectedStudent.status !== "Completed" && (
                <div className="space-y-2">
                  <Label>Ngày hẹn tư vấn</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !followUpDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {followUpDate
                          ? format(followUpDate, "dd/MM/yyyy", { locale: vi })
                          : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={followUpDate}
                        onSelect={setFollowUpDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {selectedStudent.status === "Completed" &&
                selectedStudent.follow_up_required && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-yellow-800">
                      <strong>Cần tư vấn thêm</strong>
                      <div className="text-sm mt-1">
                        Học sinh này cần được tư vấn thêm. Thông báo đã được gửi
                        cho phụ huynh.
                      </div>
                    </div>
                  </div>
                )}
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
              <div>
                <strong>Học sinh:</strong> {selectedStudent.student.full_name}{" "}
                (MSSV: {selectedStudent.student.student_id})
              </div>

              <div className="space-y-2">
                <Label>Ngày hẹn tư vấn</Label>
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
                        ? format(consultationDate, "dd/MM/yyyy", { locale: vi })
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
                <Label htmlFor="consultation_time">Giờ hẹn</Label>
                <Input
                  id="consultation_time"
                  type="time"
                  value={consultationTime}
                  onChange={(e) => setConsultationTime(e.target.value)}
                  placeholder="Chọn giờ hẹn"
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

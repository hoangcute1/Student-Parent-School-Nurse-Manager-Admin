"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchData } from "@/lib/api/api";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

interface VaccinationRecord {
  studentId: string;
  studentName: string;
  vaccinationStatus: "completed" | "contraindication" | "postponed";
  reaction: "normal" | "mild" | "moderate" | "severe";
  postVaccinationMonitoring: string;
  medicalNotes: string;
  vaccinatedAt: string;
  vaccinatedBy: string;
}

export default function VaccinationClassDetailPage() {
  const { eventId, classId } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [classDetail, setClassDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vaccinationRecords, setVaccinationRecords] = useState<
    VaccinationRecord[]
  >([]);
  const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [savingVaccination, setSavingVaccination] = useState(false);
  const [vaccinationForm, setVaccinationForm] = useState({
    vaccinationStatus: "completed" as
      | "completed"
      | "contraindication"
      | "postponed",
    reaction: "normal" as "normal" | "mild" | "moderate" | "severe",
    postVaccinationMonitoring: "",
    medicalNotes: "",
  });

  // Load vaccination records from localStorage when eventId and classId are available
  useEffect(() => {
    if (eventId && classId) {
      const storageKey = `vaccination-records-${eventId}-${classId}`;
      console.log("Loading vaccination records with key:", storageKey);

      const savedRecords = localStorage.getItem(storageKey);
      if (savedRecords) {
        try {
          const parsedRecords = JSON.parse(savedRecords);
          console.log("Loaded vaccination records:", parsedRecords);
          setVaccinationRecords(parsedRecords);
        } catch (error) {
          console.error(
            "Error loading vaccination records from localStorage:",
            error
          );
        }
      } else {
        console.log("No saved vaccination records found");
      }
    }
  }, [eventId, classId]);

  // Save vaccination records to localStorage whenever they change
  useEffect(() => {
    if (eventId && classId && vaccinationRecords.length > 0) {
      const storageKey = `vaccination-records-${eventId}-${classId}`;
      console.log("Saving vaccination records with key:", storageKey);
      console.log("Records to save:", vaccinationRecords);

      localStorage.setItem(storageKey, JSON.stringify(vaccinationRecords));
    }
  }, [vaccinationRecords, eventId, classId]);

  const fetchClassDetail = async () => {
    setLoading(true);
    setError("");
    try {
      // Lấy thông tin event tổng thể
      const eventData = await fetchData(
        `/vaccination-schedules/events/${eventId}`
      );
      setEvent(eventData);
      // Lấy chi tiết lớp
      const classData = await fetchData(
        `/vaccination-schedules/events/${eventId}/classes/${classId}`
      );
      setClassDetail(classData);
    } catch (err: any) {
      setError(err.message || "Không thể tải chi tiết lớp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId && classId) fetchClassDetail();
  }, [eventId, classId]);

  // Thêm log để kiểm tra event object
  useEffect(() => {
    if (event) {
      console.log("eventData:", event);
    }
  }, [event]);

  const handleVaccinate = (student: any) => {
    setSelectedStudent(student);
    setVaccinationForm({
      vaccinationStatus: "completed" as
        | "completed"
        | "contraindication"
        | "postponed",
      reaction: "normal" as "normal" | "mild" | "moderate" | "severe",
      postVaccinationMonitoring: "",
      medicalNotes: "",
    });
    setIsVaccinationModalOpen(true);
  };

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
    setIsDetailsModalOpen(true);
  };

  const handleSaveVaccination = async () => {
    if (!selectedStudent) return;

    setSavingVaccination(true);

    try {
      const studentId =
        selectedStudent.student?._id || selectedStudent.student?.student_id;
      const vaccinationId = selectedStudent.vaccination_id;

      // Tạo kết quả tiêm chủng để gửi về backend
      const vaccinationResult = {
        vaccination_result: JSON.stringify({
          status: vaccinationForm.vaccinationStatus,
          postVaccinationMonitoring: vaccinationForm.postVaccinationMonitoring,
          reaction: vaccinationForm.reaction,
          injection_site: "left_arm", // Có thể thêm field để chọn vị trí tiêm
          reaction_severity: vaccinationForm.reaction,
          doctor_name: event.doctor_name || "Bác sĩ phụ trách sự kiện",
        }),
        vaccination_notes: vaccinationForm.medicalNotes,
        recommendations: vaccinationForm.postVaccinationMonitoring,
        follow_up_required:
          vaccinationForm.vaccinationStatus === "contraindication" ||
          vaccinationForm.reaction !== "normal",
        follow_up_date:
          vaccinationForm.vaccinationStatus === "contraindication" ||
          vaccinationForm.reaction !== "normal"
            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 ngày sau
            : undefined,
      };

      console.log("Sending vaccination result to backend:", vaccinationResult);

      // Gửi kết quả tiêm chủng về backend
      await fetchData(`/vaccination-schedules/${vaccinationId}/result`, {
        method: "PUT",
        body: JSON.stringify(vaccinationResult),
      });

      // Tạo record cho localStorage
      const newRecord: VaccinationRecord = {
        studentId: studentId,
        studentName: selectedStudent.student?.name,
        vaccinationStatus: vaccinationForm.vaccinationStatus as
          | "completed"
          | "contraindication"
          | "postponed",
        reaction: vaccinationForm.reaction as
          | "normal"
          | "mild"
          | "moderate"
          | "severe",
        postVaccinationMonitoring: vaccinationForm.postVaccinationMonitoring,
        medicalNotes: vaccinationForm.medicalNotes,
        vaccinatedAt: new Date().toISOString(),
        vaccinatedBy: event.doctor_name || "Bác sĩ phụ trách sự kiện",
      };

      console.log("Creating new vaccination record:", newRecord);

      // Add to local state (will be automatically saved to localStorage via useEffect)
      setVaccinationRecords((prev) => {
        // Check if record already exists for this student
        const existingIndex = prev.findIndex(
          (record) => record.studentId === newRecord.studentId
        );
        if (existingIndex >= 0) {
          // Update existing record
          const updated = [...prev];
          updated[existingIndex] = newRecord;
          console.log("Updated existing record, new state:", updated);
          return updated;
        } else {
          // Add new record
          const newState = [...prev, newRecord];
          console.log("Added new record, new state:", newState);
          return newState;
        }
      });

      toast.success(
        "Ghi nhận tiêm chủng thành công! Kết quả đã được gửi cho phụ huynh."
      );
      setIsVaccinationModalOpen(false);
      setSelectedStudent(null);

      // Fetch lại dữ liệu lớp để cập nhật trạng thái tiêm
      await fetchClassDetail();
    } catch (error) {
      console.error("Error saving vaccination result:", error);
      toast.error("Có lỗi xảy ra khi ghi nhận tiêm chủng. Vui lòng thử lại.");
    } finally {
      setSavingVaccination(false);
    }
  };

  const getVaccinationRecord = (studentId: string) => {
    const record = vaccinationRecords.find(
      (record) => record.studentId === studentId
    );
    console.log(`Looking for student ${studentId}, found:`, record);
    return record;
  };

  const getVaccinationStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Đã tiêm</Badge>;
      case "contraindication":
        return (
          <Badge className="bg-red-100 text-red-800">Chống chỉ định</Badge>
        );
      case "postponed":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Hoãn tiêm</Badge>
        );
      default:
        return <Badge variant="secondary">Chưa tiêm</Badge>;
    }
  };

  const getReactionBadge = (reaction: string) => {
    switch (reaction) {
      case "normal":
        return (
          <Badge className="bg-green-100 text-green-800">Bình thường</Badge>
        );
      case "mild":
        return <Badge className="bg-yellow-100 text-yellow-800">Nhẹ</Badge>;
      case "moderate":
        return (
          <Badge className="bg-orange-100 text-orange-800">Trung bình</Badge>
        );
      case "severe":
        return <Badge className="bg-red-100 text-red-800">Nghiêm trọng</Badge>;
      default:
        return <Badge variant="secondary">Không có thông tin</Badge>;
    }
  };

  if (loading)
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!event || !classDetail)
    return <div className="p-8 text-center">Không tìm thấy dữ liệu</div>;

  // Lấy tất cả học sinh đã đồng ý và đã tiêm (bao gồm cả học sinh đã tiêm xong)
  const agreedStudents =
    classDetail.students?.filter((s: any) => {
      const st = String(s.status).toLowerCase();
      return st === "approved" || st === "agreed" || st === "completed";
    }) || [];
  const totalAgreed = agreedStudents.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Nút quay lại danh sách */}
      <div className="flex justify-start mb-2">
        <Button
          variant="secondary"
          className="flex items-center gap-2 text-blue-800 bg-blue-100 border-none hover:bg-blue-200 font-semibold rounded-full px-5 py-2 shadow-sm"
          onClick={() =>
            router.push(`/cms/vaccination-management/event/${eventId}`)
          }
        >
          <span className="text-xl">&larr;</span>
          <span>Quay lại danh sách</span>
        </Button>
      </div>
      <Card className="p-8 border rounded-xl shadow bg-white mb-4">
        <div className="text-2xl font-bold mb-4 text-blue-900">
          Chi tiết lớp{" "}
          <span className="text-blue-700">{classDetail.class_name}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div>
            <div className="font-semibold">Sự kiện:</div>
            <div className="mb-2">{event.title}</div>
            <div className="font-semibold">Giờ tiêm:</div>
            <div className="mb-2">{event.vaccination_time || "-"}</div>
            <div className="font-semibold">Loại vaccine:</div>
            <div className="mb-2 text-blue-700 font-bold">
              {event.vaccine_type || event.vaccineType || event.vaccine || "-"}
            </div>
          </div>
          <div>
            <div className="font-semibold">Ngày tiêm:</div>
            <div className="mb-2">
              {event.vaccination_date
                ? new Date(event.vaccination_date).toLocaleDateString()
                : "-"}
            </div>
            <div className="font-semibold">Địa điểm:</div>
            <div className="mb-2">{event.location}</div>
          </div>
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách học sinh đã đồng ý tiêm chủng</CardTitle>
          <CardDescription>
            Hiển thị tất cả học sinh đã được phụ huynh đồng ý tiêm chủng (bao
            gồm cả học sinh đã tiêm xong)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classDetail?.students
              ?.filter(
                (s: any) => s.status === "Approved" || s.status === "Completed"
              )
              .map((student: any) => (
                <div
                  key={
                    student.student?._id ||
                    student.student?.student_id ||
                    student.student?.id
                  }
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    {/* Icon trạng thái */}
                    {student.status === "Completed" ? (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <div className="font-medium">
                        {student.student?.full_name ||
                          student.student?.name ||
                          "Không xác định"}
                      </div>
                      <div className="text-sm text-gray-600">
                        MSSV:{" "}
                        {student.student?.student_id ||
                          student.student?.id ||
                          "Không xác định"}
                      </div>
                      <div className="text-xs text-blue-600">
                        Trạng thái:{" "}
                        {student.status === "Completed"
                          ? "Đã tiêm"
                          : "Chờ tiêm"}
                      </div>
                      {/* Nếu có phản ứng */}
                      {student.reaction && (
                        <div className="text-xs text-gray-500">
                          Phản ứng: {student.reaction}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        student.status === "Completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {student.status === "Completed" ? "Đã tiêm" : "Chờ tiêm"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsVaccinationModalOpen(true);
                      }}
                      className={`flex items-center gap-1 ${
                        student.status === "Completed"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={student.status === "Completed"}
                    >
                      <span className="flex items-center gap-1">
                        <span role="img" aria-label="Tiêm">
                          💉
                        </span>
                        {student.status === "Completed" ? "Đã tiêm" : "Tiêm"}
                      </span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(student)}
                      className="flex items-center gap-1"
                    >
                      Chi tiết
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal ghi nhận tiêm chủng */}
      <Dialog
        open={isVaccinationModalOpen}
        onOpenChange={setIsVaccinationModalOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Ghi nhận tiêm chủng - {selectedStudent?.student?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="vaccinationStatus">Trạng thái tiêm *</Label>
              <Select
                value={vaccinationForm.vaccinationStatus}
                onValueChange={(value) =>
                  setVaccinationForm((prev) => ({
                    ...prev,
                    vaccinationStatus: value as
                      | "completed"
                      | "contraindication"
                      | "postponed",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Đã tiêm</SelectItem>
                  <SelectItem value="contraindication">
                    Chống chỉ định
                  </SelectItem>
                  <SelectItem value="postponed">Hoãn tiêm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reaction">Phản ứng *</Label>
              <Select
                value={vaccinationForm.reaction}
                onValueChange={(value) =>
                  setVaccinationForm((prev) => ({
                    ...prev,
                    reaction: value as
                      | "normal"
                      | "mild"
                      | "moderate"
                      | "severe",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức độ phản ứng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Bình thường</SelectItem>
                  <SelectItem value="mild">Nhẹ</SelectItem>
                  <SelectItem value="moderate">Trung bình</SelectItem>
                  <SelectItem value="severe">Nghiêm trọng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="postVaccinationMonitoring">
                Theo dõi sau tiêm
              </Label>
              <Textarea
                id="postVaccinationMonitoring"
                placeholder="Ghi chú về việc theo dõi sau tiêm..."
                value={vaccinationForm.postVaccinationMonitoring}
                onChange={(e) =>
                  setVaccinationForm((prev) => ({
                    ...prev,
                    postVaccinationMonitoring: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="medicalNotes">Ghi chú y tế</Label>
              <Textarea
                id="medicalNotes"
                placeholder="Ghi chú y tế khác..."
                value={vaccinationForm.medicalNotes}
                onChange={(e) =>
                  setVaccinationForm((prev) => ({
                    ...prev,
                    medicalNotes: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsVaccinationModalOpen(false)}
                disabled={savingVaccination}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSaveVaccination}
                className="bg-green-600 hover:bg-green-700"
                disabled={savingVaccination}
              >
                {savingVaccination ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal xem chi tiết */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Chi tiết tiêm chủng - {selectedStudent?.student?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {(() => {
              const record = selectedStudent
                ? getVaccinationRecord(
                    selectedStudent.student?._id ||
                      selectedStudent.student?.student_id
                  )
                : null;

              // Kiểm tra xem học sinh đã được tiêm chưa (từ backend)
              const isVaccinated =
                selectedStudent &&
                (selectedStudent.status === "COMPLETED" ||
                  selectedStudent.status === "Completed" ||
                  selectedStudent.status === "completed" ||
                  selectedStudent.vaccination_result);

              if (!record && !isVaccinated) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <p>Chưa có thông tin tiêm chủng cho học sinh này</p>
                  </div>
                );
              }

              // Nếu có record từ localStorage, hiển thị thông tin chi tiết
              if (record) {
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-semibold">
                          Trạng thái tiêm:
                        </Label>
                        <div className="mt-1">
                          {getVaccinationStatusBadge(record.vaccinationStatus)}
                        </div>
                      </div>
                      <div>
                        <Label className="font-semibold">Thời gian tiêm:</Label>
                        <div className="mt-1 text-sm">
                          {new Date(record.vaccinatedAt).toLocaleString(
                            "vi-VN"
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="font-semibold">
                        Theo dõi sau tiêm:
                      </Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md">
                        {record.postVaccinationMonitoring || "Không có"}
                      </div>
                    </div>

                    <div>
                      <Label className="font-semibold">Phản ứng:</Label>
                      <div className="mt-1">
                        {getReactionBadge(record.reaction)}
                      </div>
                    </div>

                    <div>
                      <Label className="font-semibold">Ghi chú của y tế:</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md">
                        {record.medicalNotes || "Không có"}
                      </div>
                    </div>

                    <div>
                      <Label className="font-semibold">Bác sĩ thực hiện:</Label>
                      <div className="mt-1 text-sm">{record.vaccinatedBy}</div>
                    </div>
                  </div>
                );
              }

              // Nếu không có record từ localStorage nhưng học sinh đã được tiêm (từ backend)
              if (isVaccinated) {
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-semibold">
                          Trạng thái tiêm:
                        </Label>
                        <div className="mt-1">
                          <Badge className="bg-green-100 text-green-800">
                            Đã tiêm
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="font-semibold">
                          Cập nhật lần cuối:
                        </Label>
                        <div className="mt-1 text-sm">
                          {selectedStudent.updated_at
                            ? new Date(
                                selectedStudent.updated_at
                              ).toLocaleString("vi-VN")
                            : "Không có thông tin"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="font-semibold">
                        Kết quả tiêm chủng:
                      </Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md">
                        {(() => {
                          try {
                            const result = JSON.parse(
                              selectedStudent.vaccination_result || "{}"
                            );
                            return (
                              <div className="space-y-1">
                                <div>
                                  <span className="font-medium">
                                    Trạng thái:
                                  </span>{" "}
                                  {result.status || "-"}
                                </div>
                                <div>
                                  <span className="font-medium">
                                    Giám sát sau tiêm:
                                  </span>{" "}
                                  {result.postVaccinationMonitoring || "-"}
                                </div>
                              </div>
                            );
                          } catch {
                            return (
                              selectedStudent.vaccination_result || "Không có"
                            );
                          }
                        })()}
                      </div>
                    </div>

                    <div>
                      <Label className="font-semibold">Phản ứng:</Label>
                      <div className="mt-1">
                        {(() => {
                          try {
                            const result = JSON.parse(
                              selectedStudent.vaccination_result || "{}"
                            );
                            const reaction =
                              result.reaction ||
                              result.reaction_severity ||
                              "normal";
                            return getReactionBadge(reaction);
                          } catch {
                            return (
                              <Badge variant="secondary">
                                Không có thông tin
                              </Badge>
                            );
                          }
                        })()}
                      </div>
                    </div>

                    <div>
                      <Label className="font-semibold">Khuyến nghị:</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md">
                        {selectedStudent.recommendations || "Không có"}
                      </div>
                    </div>

                    <div>
                      <Label className="font-semibold">Ghi chú y tế:</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md">
                        {selectedStudent.vaccination_notes || "Không có"}
                      </div>
                    </div>

                    <div>
                      <Label className="font-semibold">Bác sĩ thực hiện:</Label>
                      <div className="mt-1 text-sm">
                        {(() => {
                          try {
                            const result = JSON.parse(
                              selectedStudent.vaccination_result || "{}"
                            );
                            return (
                              result.doctor_name ||
                              event.doctor_name ||
                              "Bác sĩ phụ trách sự kiện"
                            );
                          } catch {
                            return (
                              event.doctor_name || "Bác sĩ phụ trách sự kiện"
                            );
                          }
                        })()}
                      </div>
                    </div>

                    {selectedStudent.follow_up_required && (
                      <div>
                        <Label className="font-semibold">Cần theo dõi:</Label>
                        <div className="mt-1 p-3 bg-yellow-50 rounded-md">
                          <p className="text-yellow-800">Cần tư vấn thêm</p>
                          {selectedStudent.follow_up_date && (
                            <p className="text-sm text-yellow-600 mt-1">
                              Ngày hẹn:{" "}
                              {new Date(
                                selectedStudent.follow_up_date
                              ).toLocaleDateString("vi-VN")}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            })()}

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Đóng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

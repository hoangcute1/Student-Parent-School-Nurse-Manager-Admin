"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Calendar,
  CalendarIcon,
  Syringe,
  Users,
  MapPin,
  Clock,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { fetchData } from "@/lib/api/api";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

interface CreateVaccinationScheduleProps {
  onClose: () => void;
  onSuccess: (newSchedule: any) => void;
}

export function CreateVaccinationSchedule({
  onClose,
  onSuccess,
}: CreateVaccinationScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    eventTitle: "",
    vaccineName: "",
    gradeLevel: "",
    location: "",
    time: "",
    description: "",
    deadline: "",
    doctorName: "",
    studentIds: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const [studentsByGrade, setStudentsByGrade] = useState<
    { id: string; name: string }[]
  >([]);

  // Khi chọn khối lớp, fetch danh sách học sinh thực tế
  useEffect(() => {
    if (formData.gradeLevel) {
      fetchData(`/students/grade/${formData.gradeLevel}`)
        .then((data) => {
          // Lấy _id của tất cả học sinh (BE có thể trả về student._id hoặc _id)
          const studentIds = Array.isArray(data)
            ? data.map((s: any) => s.student?._id || s._id || s.id)
            : [];
          setStudentsByGrade(
            Array.isArray(data)
              ? data.map((s: any) => ({
                  id: s.student?._id || s._id || s.id,
                  name: s.student?.name || s.name,
                }))
              : []
          );
          setFormData((prev) => ({
            ...prev,
            studentIds: studentIds,
          }));
        })
        .catch(() => {
          setStudentsByGrade([]);
          setFormData((prev) => ({ ...prev, studentIds: [] }));
        });
    } else {
      setStudentsByGrade([]);
      setFormData((prev) => ({ ...prev, studentIds: [] }));
    }
  }, [formData.gradeLevel]);

  // Không cho phép chọn học sinh thủ công nữa
  // Bỏ handleStudentSelect và mọi UI liên quan đến chọn checkbox học sinh

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.eventTitle ||
      !formData.vaccineName ||
      !formData.gradeLevel ||
      !selectedDate ||
      !formData.time ||
      !formData.location ||
      formData.studentIds.length === 0
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc và chọn học sinh!");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title: formData.eventTitle,
        description: formData.description,
        vaccination_date: selectedDate.toISOString().slice(0, 10),
        vaccination_time: formData.time,
        location: formData.location,
        doctor_name: formData.doctorName,
        vaccine_type: formData.vaccineName,
        student_ids: formData.studentIds,
        grade_level: Number(formData.gradeLevel),
      };
      await fetchData<any>("/vaccination-schedules", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast.success(
        `Tạo lịch tiêm chủng thành công cho ${
          formData.vaccineName || "[Tên vaccine]"
        } - ${formData.gradeLevel || "[Khối lớp]"}`
      );
      onSuccess(payload);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Không thể tạo lịch tiêm chủng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Syringe className="w-5 h-5" />
            Tạo lịch tiêm chủng mới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin sự kiện */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-blue-700 flex items-center gap-2">
                <Syringe className="w-4 h-4" />
                Thông tin sự kiện
              </h3>
              <div className="space-y-2">
                <Label htmlFor="eventTitle">Tiêu đề sự kiện *</Label>
                <Input
                  id="eventTitle"
                  value={formData.eventTitle}
                  onChange={(e) =>
                    handleInputChange("eventTitle", e.target.value)
                  }
                  placeholder="VD: Lịch tiêm chủng khối 2 năm 2024"
                  required
                />
              </div>
            </div>
            {/* Thông tin vaccine */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-blue-700 flex items-center gap-2">
                <Syringe className="w-4 h-4" />
                Thông tin vaccine
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vaccineName">Tên vaccine *</Label>
                  <Select
                    value={formData.vaccineName}
                    onValueChange={(value) =>
                      handleInputChange("vaccineName", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại vaccine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hepatitis-b">Viêm gan B</SelectItem>
                      <SelectItem value="dpt">
                        DPT (Bạch hầu, Ho gà, Uốn ván)
                      </SelectItem>
                      <SelectItem value="polio">Bại liệt</SelectItem>
                      <SelectItem value="mmr">
                        MMR (Sởi, Quai bị, Rubella)
                      </SelectItem>
                      <SelectItem value="bcg">BCG (Lao)</SelectItem>
                      <SelectItem value="flu">Cúm mùa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gradeLevel">Khối lớp *</Label>
                  <Select
                    value={formData.gradeLevel}
                    onValueChange={(value) =>
                      handleInputChange("gradeLevel", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khối lớp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Khối 1</SelectItem>
                      <SelectItem value="2">Khối 2</SelectItem>
                      <SelectItem value="3">Khối 3</SelectItem>
                      <SelectItem value="4">Khối 4</SelectItem>
                      <SelectItem value="5">Khối 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Chọn học sinh */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-orange-700 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Chọn học sinh tham gia
              </h3>
              {formData.gradeLevel && (
                <div className="space-y-2">
                  <Label>
                    Học sinh trong khối {formData.gradeLevel} sẽ được thêm:
                  </Label>
                  <ul className="list-disc ml-6 text-sm text-blue-700">
                    {studentsByGrade.map((student) => (
                      <li key={student.id}>{student.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Thời gian và địa điểm */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-green-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Thời gian và địa điểm
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày tiêm *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate
                          ? format(selectedDate, "dd/MM/yyyy", { locale: vi })
                          : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Giờ tiêm *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="time"
                      type="time"
                      className="pl-10"
                      value={formData.time}
                      onChange={(e) =>
                        handleInputChange("time", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Địa điểm *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    className="pl-10"
                    placeholder="Ví dụ: Phòng y tế trường, Trung tâm y tế..."
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorName">Bác sĩ phụ trách</Label>
                <Input
                  id="doctorName"
                  placeholder="Tên bác sĩ (nếu có)"
                  value={formData.doctorName}
                  onChange={(e) =>
                    handleInputChange("doctorName", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Ghi chú */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-purple-700">
                Ghi chú và hướng dẫn
              </h3>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <Textarea
                  id="description"
                  placeholder="Ghi chú về vaccine, lưu ý đặc biệt, hướng dẫn chuẩn bị..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                />
              </div>
            </div>

            {/* Preview thông báo */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-orange-700">
                Xem trước thông báo gửi phụ huynh
              </h3>

              <div className="bg-blue-50 p-4 rounded-lg border">
                <div className="text-sm text-blue-800 space-y-2">
                  <p className="font-semibold">🏥 THÔNG BÁO TIÊM CHỦNG</p>
                  <p>
                    Trường thông báo chương trình tiêm chủng{" "}
                    <strong>{formData.vaccineName || "[Tên vaccine]"}</strong>
                    cho <strong>{formData.gradeLevel || "[Khối lớp]"}</strong>
                  </p>
                  <p>
                    📅 Thời gian:{" "}
                    {selectedDate
                      ? format(selectedDate, "dd/MM/yyyy", { locale: vi })
                      : "[Ngày]"}
                    lúc {formData.time || "[Giờ]"}
                  </p>
                  <p>📍 Địa điểm: {formData.location || "[Địa điểm]"}</p>
                  <p>
                    ⏰ Hạn phản hồi: {formData.deadline || "[Hạn phản hồi]"}
                  </p>
                  {formData.description && (
                    <p>📝 Ghi chú: {formData.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  "Đang tạo..."
                ) : (
                  <>
                    <Syringe className="w-4 h-4 mr-2" />
                    Tạo lịch tiêm
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

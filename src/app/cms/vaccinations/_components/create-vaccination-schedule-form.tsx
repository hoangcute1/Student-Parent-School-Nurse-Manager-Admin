"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Plus, Search, Syringe } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { fetchData } from "@/lib/api/api";

interface Student {
  _id: string;
  name: string;
  student_id: string;
  class: {
    _id: string;
    name: string;
    grade_level: number;
  };
}

interface CreateVaccinationScheduleFormProps {
  onSuccess: () => void;
}

export default function CreateVaccinationScheduleForm({
  onSuccess,
}: CreateVaccinationScheduleFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState<Date>();
  const [vaccinationTime, setVaccinationTime] = useState("");
  const [location, setLocation] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [vaccineType, setVaccineType] = useState("");

  // Student selection
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [gradeLevel, setGradeLevel] = useState<number>();

  // Debounced search
  const searchStudents = useCallback(async (term: string) => {
    if (!term.trim()) {
      setStudents([]);
      return;
    }

    setSearchLoading(true);
    try {
      const data = await fetchData<Student[]>(
        `/students/search?q=${encodeURIComponent(term)}`
      );
      setStudents(data);
    } catch (error) {
      console.error("Error searching students:", error);
      toast.error("Không thể tìm kiếm học sinh");
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchStudents(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchStudents]);

  const handleStudentSelect = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents((prev) => [...prev, studentId]);
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handleSelectByGrade = async (grade: number) => {
    try {
      setSearchLoading(true);
      const data = await fetchData<Student[]>(`/students/by-grade/${grade}`);
      const gradeStudentIds = data.map((student) => student._id);
      setSelectedStudents((prev) => {
        const newSelected = [...prev];
        gradeStudentIds.forEach((id) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
      setStudents(data);
      toast.success(`Đã chọn tất cả học sinh khối ${grade}`);
    } catch (error) {
      console.error("Error fetching students by grade:", error);
      toast.error("Không thể tải danh sách học sinh theo khối");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề lịch tiêm");
      return;
    }

    if (!description.trim()) {
      toast.error("Vui lòng nhập mô tả");
      return;
    }

    if (!vaccinationDate) {
      toast.error("Vui lòng chọn ngày tiêm");
      return;
    }

    if (!vaccinationTime.trim()) {
      toast.error("Vui lòng nhập giờ tiêm");
      return;
    }

    if (selectedStudents.length === 0) {
      toast.error("Vui lòng chọn ít nhất một học sinh");
      return;
    }

    setLoading(true);

    try {
      const vaccinationData = {
        title: title.trim(),
        description: description.trim(),
        vaccination_date: vaccinationDate.toISOString(),
        vaccination_time: vaccinationTime.trim(),
        location: location.trim(),
        doctor_name: doctorName.trim(),
        vaccine_type: vaccineType.trim(),
        student_ids: selectedStudents,
        created_by: "current-staff-id", // TODO: Get from auth context
        grade_level: gradeLevel,
      };

      await fetchData("/vaccination-schedules", {
        method: "POST",
        body: JSON.stringify(vaccinationData),
      });

      toast.success("Tạo lịch tiêm chủng thành công!");

      // Reset form
      setTitle("");
      setDescription("");
      setVaccinationDate(undefined);
      setVaccinationTime("");
      setLocation("");
      setDoctorName("");
      setVaccineType("");
      setSelectedStudents([]);
      setStudents([]);
      setSearchTerm("");
      setGradeLevel(undefined);
      setIsOpen(false);

      onSuccess();
    } catch (error) {
      console.error("Error creating vaccination schedule:", error);
      toast.error("Không thể tạo lịch tiêm chủng");
    } finally {
      setLoading(false);
    }
  };

  const selectedStudentNames = students
    .filter((student) => selectedStudents.includes(student._id))
    .map((student) => `${student.name} (${student.class.name})`)
    .join(", ");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Tạo lịch tiêm chủng
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-800">
            <Syringe className="w-5 h-5" />
            Tạo lịch tiêm chủng mới
          </DialogTitle>
          <DialogDescription>
            Tạo lịch tiêm chủng và gửi thông báo đến phụ huynh
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Tiêu đề lịch tiêm *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Tiêm vắc-xin cúm mùa 2024"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Mô tả chi tiết *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết về lịch tiêm chủng..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ngày tiêm *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !vaccinationDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {vaccinationDate ? (
                        format(vaccinationDate, "dd/MM/yyyy", { locale: vi })
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={vaccinationDate}
                      onSelect={setVaccinationDate}
                      initialFocus
                      locale={vi}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="time">Giờ tiêm *</Label>
                <Input
                  id="time"
                  type="time"
                  value={vaccinationTime}
                  onChange={(e) => setVaccinationTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Địa điểm</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="VD: Phòng y tế trường"
                />
              </div>

              <div>
                <Label htmlFor="doctor">Bác sĩ phụ trách</Label>
                <Input
                  id="doctor"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="VD: BS. Nguyễn Văn A"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="vaccine-type">Loại vắc-xin</Label>
              <Input
                id="vaccine-type"
                value={vaccineType}
                onChange={(e) => setVaccineType(e.target.value)}
                placeholder="VD: Vắc-xin cúm mùa"
              />
            </div>
          </div>

          {/* Student Selection */}
          <div className="space-y-4">
            <div>
              <Label>Chọn học sinh *</Label>
              <div className="flex gap-2 mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm học sinh theo tên hoặc mã..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            {/* Quick select by grade */}
            <div>
              <Label>Chọn nhanh theo khối lớp</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((grade) => (
                  <Button
                    key={grade}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGradeLevel(grade);
                      handleSelectByGrade(grade);
                    }}
                    disabled={searchLoading}
                  >
                    Khối {grade}
                  </Button>
                ))}
              </div>
            </div>

            {/* Student list */}
            {students.length > 0 && (
              <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                <div className="space-y-2">
                  {students.map((student) => (
                    <div
                      key={student._id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={student._id}
                        checked={selectedStudents.includes(student._id)}
                        onCheckedChange={(checked) =>
                          handleStudentSelect(student._id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={student._id}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {student.name} - {student.student_id} (Lớp{" "}
                        {student.class.name})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedStudents.length > 0 && (
              <div className="text-sm text-gray-600">
                <strong>Đã chọn {selectedStudents.length} học sinh:</strong>
                <div className="mt-1 max-h-20 overflow-y-auto">
                  {selectedStudentNames}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Đang tạo..." : "Tạo lịch tiêm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

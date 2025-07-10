"use client";

import { useState } from "react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  User,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchData } from "@/lib/api/api";
import { useAuthStore } from "@/stores/auth-store";
import { getAuthToken, parseJwt } from "@/lib/api/auth/token";

interface GradeLevel {
  id: number;
  name: string;
  description: string;
}

interface CreateHealthExaminationFormProps {
  onSuccess?: () => void;
}

export default function CreateHealthExaminationForm({
  onSuccess,
}: CreateHealthExaminationFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const { user } = useAuthStore();

  const gradeLevels: GradeLevel[] = [
    { id: 1, name: "Khối 1", description: "Học sinh lớp 1" },
    { id: 2, name: "Khối 2", description: "Học sinh lớp 2" },
    { id: 3, name: "Khối 3", description: "Học sinh lớp 3" },
    { id: 4, name: "Khối 4", description: "Học sinh lớp 4" },
    { id: 5, name: "Khối 5", description: "Học sinh lớp 5" },
  ];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    examination_date: "",
    examination_time: "",
    location: "",
    doctor_name: "",
    examination_type: "",
    target_type: "grade",
    grade_levels: [] as number[],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGradeToggle = (gradeId: number) => {
    setSelectedGrades((prev) => {
      const newSelected = prev.includes(gradeId)
        ? prev.filter((id) => id !== gradeId)
        : [...prev, gradeId];

      setFormData((prevForm) => ({
        ...prevForm,
        grade_levels: newSelected,
      }));

      return newSelected;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error("Vui lòng nhập tiêu đề");
      }
      if (!formData.description.trim()) {
        throw new Error("Vui lòng nhập mô tả");
      }
      if (!formData.examination_date) {
        throw new Error("Vui lòng chọn ngày khám");
      }
      if (!formData.examination_time) {
        throw new Error("Vui lòng nhập giờ khám");
      }
      if (!formData.examination_type) {
        throw new Error("Vui lòng chọn loại khám");
      }
      if (
        formData.target_type === "grade" &&
        formData.grade_levels.length === 0
      ) {
        throw new Error("Vui lòng chọn ít nhất một khối lớp");
      }

      // Get user ID from auth store
      let userId = null;
      if (user && (user as any)._id) {
        userId = (user as any)._id;
      } else {
        // Fallback to getting user ID from token
        const token = getAuthToken();
        if (token) {
          const tokenData = parseJwt(token);
          userId = tokenData.sub;
        }
      }

      if (!userId) {
        throw new Error(
          "Không thể xác định người dùng. Vui lòng đăng nhập lại."
        );
      }

      // Prepare data với đúng format
      const submitData = {
        ...formData,
        examination_date: new Date(formData.examination_date).toISOString(),
      };

      console.log("Sending form data:", submitData);
      const response = await fetchData<any>(
        `/health-examinations?staffId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      // The fetchData function already returns parsed JSON data on success
      toast.success("Tạo lịch khám thành công!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        examination_date: "",
        examination_time: "",
        location: "",
        doctor_name: "",
        examination_type: "",
        target_type: "grade",
        grade_levels: [],
      });
      setSelectedGrades([]);

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating examination:", error);
      toast.error("Không thể tạo lịch khám. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.title.trim() &&
      formData.description.trim() &&
      formData.examination_date &&
      formData.examination_time.trim() &&
      formData.location.trim() &&
      formData.doctor_name.trim() &&
      formData.examination_type.trim() &&
      formData.grade_levels.length > 0
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Tạo lịch khám mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-800">
            <Calendar className="w-5 h-5" />
            Tạo lịch khám sức khỏe
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề lịch khám *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Ví dụ: Khám sức khỏe định kỳ học kỳ 1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="examination_type">Loại khám *</Label>
              <Select
                onValueChange={(value) =>
                  handleInputChange("examination_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại khám" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Khám sức khỏe định kỳ">
                    Khám sức khỏe định kỳ
                  </SelectItem>
                  <SelectItem value="Khám răng miệng">
                    Khám răng miệng
                  </SelectItem>
                  <SelectItem value="Khám mắt">Khám mắt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả chi tiết *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Mô tả chi tiết về buổi khám sức khỏe..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="examination_date">Ngày khám *</Label>
              <Input
                id="examination_date"
                type="date"
                value={formData.examination_date}
                onChange={(e) =>
                  handleInputChange("examination_date", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="examination_time">Giờ khám *</Label>
              <Input
                id="examination_time"
                type="time"
                value={formData.examination_time}
                onChange={(e) =>
                  handleInputChange("examination_time", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Địa điểm *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Ví dụ: Phòng y tế trường, Bệnh viện..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor_name">Bác sĩ phụ trách *</Label>
            <Input
              id="doctor_name"
              value={formData.doctor_name}
              onChange={(e) => handleInputChange("doctor_name", e.target.value)}
              placeholder="Tên bác sĩ hoặc nhân viên y tế"
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Chọn khối học (chọn nhiều khối) *
            </Label>

            <div className="grid grid-cols-2 gap-3">
              {gradeLevels.map((grade) => (
                <div key={grade.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`grade-${grade.id}`}
                    checked={selectedGrades.includes(grade.id)}
                    onCheckedChange={() => handleGradeToggle(grade.id)}
                  />
                  <Label
                    htmlFor={`grade-${grade.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {grade.name}
                  </Label>
                </div>
              ))}
            </div>

            {selectedGrades.length > 0 && (
              <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                Đã chọn:{" "}
                {selectedGrades
                  .map((id) => gradeLevels.find((g) => g.id === id)?.name)
                  .join(", ")}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Đang tạo..." : "Tạo lịch khám"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

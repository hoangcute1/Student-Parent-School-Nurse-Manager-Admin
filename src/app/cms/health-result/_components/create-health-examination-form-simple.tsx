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
        <Button className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3">
          <Plus className="w-5 h-5 mr-2" />
          Tạo lịch khám mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-sky-50 border border-sky-100">
        <DialogHeader className="pb-4 border-b border-sky-100">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-sky-700 to-sky-600 bg-clip-text text-transparent">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Calendar className="w-6 h-6 text-sky-600" />
            </div>
            Tạo lịch khám sức khỏe mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 mt-6">
          {/* Basic Information Section */}
          <div className="bg-white p-6 rounded-lg border border-sky-100 shadow-sm">
            <h3 className="text-lg font-semibold text-sky-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sky-700 font-medium">
                  Tiêu đề lịch khám *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Ví dụ: Khám sức khỏe định kỳ học kỳ 1"
                  className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="examination_type"
                  className="text-sky-700 font-medium"
                >
                  Loại khám *
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("examination_type", value)
                  }
                >
                  <SelectTrigger className="border-sky-200 focus:border-sky-500 focus:ring-sky-500">
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

            <div className="space-y-2 mt-4">
              <Label htmlFor="description" className="text-sky-700 font-medium">
                Mô tả chi tiết *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Mô tả chi tiết về buổi khám sức khỏe..."
                rows={3}
                className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                required
              />
            </div>
          </div>

          {/* Schedule Information Section */}
          <div className="bg-white p-6 rounded-lg border border-sky-100 shadow-sm">
            <h3 className="text-lg font-semibold text-sky-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Thời gian & Địa điểm
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="examination_date"
                  className="text-sky-700 font-medium"
                >
                  Ngày khám *
                </Label>
                <Input
                  id="examination_date"
                  type="date"
                  value={formData.examination_date}
                  onChange={(e) =>
                    handleInputChange("examination_date", e.target.value)
                  }
                  className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="examination_time"
                  className="text-sky-700 font-medium"
                >
                  Giờ khám *
                </Label>
                <Input
                  id="examination_time"
                  type="time"
                  value={formData.examination_time}
                  onChange={(e) =>
                    handleInputChange("examination_time", e.target.value)
                  }
                  className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sky-700 font-medium">
                  Địa điểm *
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Ví dụ: Phòng y tế trường"
                  className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="doctor_name"
                  className="text-sky-700 font-medium"
                >
                  Bác sĩ phụ trách *
                </Label>
                <Input
                  id="doctor_name"
                  value={formData.doctor_name}
                  onChange={(e) =>
                    handleInputChange("doctor_name", e.target.value)
                  }
                  placeholder="Tên bác sĩ hoặc nhân viên y tế"
                  className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Grade Selection Section */}
          <div className="bg-white p-6 rounded-lg border border-sky-100 shadow-sm">
            <h3 className="text-lg font-semibold text-sky-800 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Chọn khối học
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {gradeLevels.map((grade) => (
                <div
                  key={grade.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-sky-100 hover:bg-sky-50 transition-colors"
                >
                  <Checkbox
                    id={`grade-${grade.id}`}
                    checked={selectedGrades.includes(grade.id)}
                    onCheckedChange={() => handleGradeToggle(grade.id)}
                    className="border-sky-300 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
                  />
                  <Label
                    htmlFor={`grade-${grade.id}`}
                    className="text-sm cursor-pointer font-medium text-sky-700"
                  >
                    {grade.name}
                  </Label>
                </div>
              ))}
            </div>

            {selectedGrades.length > 0 && (
              <div className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-lg">
                <p className="text-sm font-medium text-sky-800">
                  Đã chọn:{" "}
                  <span className="text-sky-600">
                    {selectedGrades
                      .map((id) => gradeLevels.find((g) => g.id === id)?.name)
                      .join(", ")}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-sky-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="px-6 border-sky-200 text-sky-700 hover:bg-sky-50"
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || loading}
              className="px-6 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang tạo...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tạo lịch khám
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

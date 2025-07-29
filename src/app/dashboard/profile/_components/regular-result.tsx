"use client";

import {
  Download,
  Filter,
  Search,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  MapPin,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/layout/sidebar/progress";
import { useParentStudentsStore } from "@/stores/parent-students-store";
import { HealthRecordDialog } from "./health-record-dialog";
import {
  getHealthExaminationsCompleted,
  HealthExaminationCompleted,
} from "@/lib/api/health-examination";
import VaccinationResults from "./vaccination-results";
import { fetchData } from "@/lib/api/api";
// import { shallow } from "zustand/shallow";

// Component hiển thị thông tin chi tiết của lần khám
interface ExaminationDetailsProps {
  exam: ExaminationHistoryItem;
  isOpen: boolean;
  onClose: () => void;
}

function ExaminationDetailsDialog({
  exam,
  isOpen,
  onClose,
}: ExaminationDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-blue-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Chi tiết lần khám: {exam.type}
          </DialogTitle>
          <DialogDescription className="text-blue-600">
            Ngày khám: {exam.date}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-700">
                Bác sĩ khám:
              </div>
              <div className="text-blue-800">{exam.doctor}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-700">Kết quả:</div>
              <Badge
                variant={
                  exam.result === "Bình thường" ? "default" : "secondary"
                }
                className={
                  exam.result === "Bình thường"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {exam.result === "Bình thường" ? (
                  <CheckCircle className="mr-1 h-3 w-3" />
                ) : (
                  <AlertCircle className="mr-1 h-3 w-3" />
                )}
                {exam.result}
              </Badge>
            </div>
          </div>

          {exam.location && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-700">
                Địa điểm khám:
              </div>
              <div className="text-blue-800">{exam.location}</div>
            </div>
          )}

          {exam.measurements && exam.measurements.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-700">
                Các chỉ số:
              </div>
              <div className="bg-blue-50 rounded-lg p-3 grid grid-cols-2 gap-2">
                {exam.measurements.map((measurement, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-700">
                      {measurement.name}:
                    </span>
                    <span className="text-sm text-blue-800 font-semibold">
                      {measurement.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm font-medium text-blue-700">Ghi chú:</div>
            <div className="bg-blue-50 rounded-lg p-3 text-blue-800">
              {exam.notes}
            </div>
          </div>

          {exam.recommendations && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-700">
                Khuyến nghị:
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-blue-800">
                {exam.recommendations}
              </div>
            </div>
          )}

          {exam.nextAppointment && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-700">
                Lịch tái khám:
              </div>
              <div className="text-blue-800">{exam.nextAppointment}</div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Define the examination history item type
interface ExaminationHistoryItem {
  date: string;
  type: string;
  doctor: string;
  result: string;
  notes: string;
  location?: string;
  measurements?: { name: string; value: string }[];
  recommendations?: string;
  nextAppointment?: string;
}

export default function RegularResultsPage() {
  const selectedStudent = useParentStudentsStore(
    (state) => state.selectedStudent
  );
  const updateStudent = useParentStudentsStore((state) => state.updateStudent);
  const [selectedExam, setSelectedExam] =
    useState<ExaminationHistoryItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [healthExaminations, setHealthExaminations] = useState<
    HealthExaminationCompleted[]
  >([]);
  const [vaccinationResults, setVaccinationResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("recent");
  const [isSyncingHealthRecord, setIsSyncingHealthRecord] = useState(false);

  const handleOpenDialog = (exam: ExaminationHistoryItem) => {
    setSelectedExam(exam);
    setIsDetailsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDetailsOpen(false);
  };

  // Fetch health examination results when student is selected
  useEffect(() => {
    if (selectedStudent) {
      fetchHealthExaminations();
      fetchVaccinationResults();
    }
  }, [selectedStudent]);

  // Tự động đồng bộ healthRecord với kết quả khám sức khỏe định kỳ mới nhất
  useEffect(() => {
    if (
      !selectedStudent ||
      healthExaminations.length === 0 ||
      isSyncingHealthRecord
    )
      return;
    // Tìm kết quả khám sức khỏe định kỳ mới nhất
    const latestExam = healthExaminations
      .filter((exam) => {
        try {
          if (!exam.health_result) return false;
          const parsed = JSON.parse(exam.health_result);
          return parsed.type === "Khám sức khỏe định kỳ";
        } catch {
          return false;
        }
      })
      .sort(
        (a, b) =>
          new Date(b.examination_date).getTime() -
          new Date(a.examination_date).getTime()
      )[0];
    if (!latestExam) return;
    // Lấy các chỉ số từ kết quả mới nhất
    let height = "";
    let weight = "";
    let vision = "";
    try {
      const parsed = JSON.parse(latestExam.health_result);
      height = parsed.height || "";
      weight = parsed.weight || "";
      vision = parsed.vision || "";
    } catch {}
    // Nếu healthRecord hiện tại khác với kết quả mới nhất thì cập nhật
    const current = selectedStudent.healthRecord;
    if (
      height &&
      weight &&
      vision &&
      (current.height !== height ||
        current.weight !== weight ||
        current.vision !== vision)
    ) {
      setIsSyncingHealthRecord(true);
      updateStudent(selectedStudent.student._id, {
        height,
        weight,
        vision,
      }).finally(() => {
        setIsSyncingHealthRecord(false);
      });
    }
  }, [selectedStudent, healthExaminations, updateStudent]);

  const fetchHealthExaminations = async () => {
    if (!selectedStudent) return;

    try {
      setLoading(true);
      setError(null);
      const results = await getHealthExaminationsCompleted(
        selectedStudent.student._id
      );
      setHealthExaminations(results);
    } catch (err) {
      console.error("Error fetching health examinations:", err);
      setError("Không thể tải kết quả khám sức khỏe");
    } finally {
      setLoading(false);
    }
  };

  const fetchVaccinationResults = async () => {
    if (!selectedStudent) return;
    try {
      setLoading(true);
      setError(null);
      const results = await fetchData<any[]>(
        `/vaccination-schedules/results/student/${selectedStudent.student._id}`
      );
      setVaccinationResults(results);
    } catch (err) {
      console.error("Error fetching vaccination results:", err);
      setError("Không thể tải kết quả tiêm chủng");
    } finally {
      setLoading(false);
    }
  };

  // Transform health examination data to match the expected format
  const transformHealthExamToResult = (exam: HealthExaminationCompleted) => {
    let measurements: { name: string; value: string }[] = [];

    // Parse health_result JSON if it exists
    if (exam.health_result) {
      try {
        const parsedResult = JSON.parse(exam.health_result);
        if (parsedResult.type === "Khám sức khỏe định kỳ") {
          measurements = [
            { name: "Chiều cao", value: parsedResult.height || "N/A" },
            { name: "Cân nặng", value: parsedResult.weight || "N/A" },
            { name: "BMI", value: parsedResult.bmi || "N/A" },
            { name: "Thị lực", value: parsedResult.vision || "N/A" },
          ];
        } else if (parsedResult.type === "Khám răng miệng") {
          measurements = [
            { name: "Răng sữa", value: parsedResult.milk_teeth || "N/A" },
            {
              name: "Răng vĩnh viễn",
              value: parsedResult.permanent_teeth || "N/A",
            },
            { name: "Sâu răng", value: parsedResult.cavities || "Không có" },
          ];
        } else if (parsedResult.type === "Khám mắt") {
          measurements = [
            {
              name: "Thị lực mắt phải",
              value: parsedResult.right_eye_vision || "N/A",
            },
            {
              name: "Thị lực mắt trái",
              value: parsedResult.left_eye_vision || "N/A",
            },
            { name: "Nhãn áp", value: parsedResult.eye_pressure || "N/A" },
          ];
        }
      } catch (error) {
        console.error("Error parsing health result:", error);
      }
    }

    return {
      type: exam.examination_type,
      date: new Date(exam.examination_date).toLocaleDateString("vi-VN"),
      status: exam.recommendations
        ? exam.recommendations.includes("bình thường") ||
          exam.recommendations.includes("tốt")
          ? "Bình thường"
          : "Cần theo dõi"
        : "Bình thường",
      measurements,
      notes: exam.examination_notes || "Không có ghi chú",
      doctor:
        exam.created_by?.full_name || exam.doctor_name || "Không xác định",
      location: exam.location || "Không xác định",
      recommendations: exam.recommendations || "",
      needFollowUp: exam.follow_up_required || false,
    };
  };

  // Convert health examinations to recent results format (if there are any real results)
  const recentResultsFromAPI = healthExaminations
    .slice(0, 6)
    .map(transformHealthExamToResult);

  // Use real data if available, otherwise fall back to mock data
  const displayRecentResults =
    recentResultsFromAPI.length > 0 ? recentResultsFromAPI : [];

  // Transform health examination to unified format
  const transformHealthExamToHistory = (exam: HealthExaminationCompleted) => ({
    date: new Date(exam.examination_date).toLocaleDateString("vi-VN"),
    type: "Khám sức khỏe",
    subtype: exam.examination_type,
    doctor: exam.created_by?.full_name || exam.doctor_name || "Không xác định",
    result: exam.recommendations
      ? exam.recommendations.includes("bình thường") ||
        exam.recommendations.includes("tốt")
        ? "Bình thường"
        : "Cần theo dõi"
      : "Bình thường",
    notes: exam.examination_notes || "Không có ghi chú",
    location: exam.location || "Không xác định",
  });

  // Transform vaccination result to unified format
  const transformVaccinationToHistory = (v: any) => {
    let doctor = v.doctor_name || "Bác sĩ phụ trách sự kiện";
    if (v.vaccination_result) {
      try {
        const parsed = JSON.parse(v.vaccination_result);
        if (parsed.doctor_name) doctor = parsed.doctor_name;
      } catch {}
    }
    return {
      date: new Date(v.vaccination_date).toLocaleDateString("vi-VN"),
      type: "Tiêm chủng",
      subtype: v.title || v.vaccine_type || "",
      doctor,
      result: "Hoàn thành",
      notes: v.recommendations || v.vaccination_notes || "Không có ghi chú",
      location: v.location || "Không xác định",
    };
  };

  // Merge and sort all events by date descending
  const mergedHistory = [
    ...healthExaminations.map(transformHealthExamToHistory),
    ...vaccinationResults.map(transformVaccinationToHistory),
  ].sort((a, b) => {
    // Sort by date descending (dd/mm/yyyy)
    const [da, ma, ya] = a.date.split("/").map(Number);
    const [db, mb, yb] = b.date.split("/").map(Number);
    const dateA = new Date(ya, ma - 1, da).getTime();
    const dateB = new Date(yb, mb - 1, db).getTime();
    return dateB - dateA;
  });

  // Hiển thị thông báo nếu không có học sinh nào được chọn
  if (!selectedStudent) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Kết quả khám
          </h1>
          <p className="text-blue-600">
            Xem kết quả kiểm tra sức khỏe định kỳ và theo dõi sự phát triển của
            học sinh.
          </p>
        </div>
        <Card className="border-blue-100 bg-blue-50/30">
          <CardContent className="p-6">
            <div className="text-center text-blue-600">
              Chưa có học sinh nào được chọn. Vui lòng chọn học sinh từ sidebar.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Kết quả sức khoẻ - {selectedStudent.student.name}
          </h1>
          <p className="text-blue-600">
            Xem kết quả kiểm tra sức khỏe định kỳ và theo dõi sự phát triển của
            học sinh.
          </p>
        </div>
        <HealthRecordDialog
          student={selectedStudent}
          trigger={
            <Button
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <FileText className="mr-2 h-4 w-4" />
              Xem hồ sơ sức khỏe đầy đủ
            </Button>
          }
        />
      </div>

      <div className="space-y-4">
        {/* Hiển thị kết quả khám sức khỏe gần đây */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-blue-600">Đang tải kết quả...</div>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50/30">
            <CardContent className="p-6">
              <div className="text-center text-red-600">{error}</div>
            </CardContent>
          </Card>
        ) : displayRecentResults.length === 0 ? (
          <Card className="border-blue-100 bg-blue-50/30">
            <CardContent className="p-6">
              <div className="text-center text-blue-600">
                Chưa có kết quả khám sức khỏe nào cho học sinh này.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayRecentResults.map((result, index) => (
              <Card
                key={index}
                className="border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg text-blue-800">
                        {result.type}
                      </CardTitle>
                    </div>
                    <Badge
                      variant={
                        result.status === "Bình thường"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        result.status === "Bình thường"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {result.status === "Bình thường" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {result.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-blue-600">
                    Ngày khám: {result.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.measurements.map((m, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{m.name}</span>
                        <span className="font-semibold text-blue-800">
                          {m.value}
                        </span>
                      </div>
                    ))}
                    <div className="text-xs text-gray-500 mt-2">
                      {result.notes}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedExam && (
        <ExaminationDetailsDialog
          exam={selectedExam}
          isOpen={isDetailsOpen}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
}

const recentResults = [
  {
    type: "Khám sức khỏe định kỳ",
    date: "15/05/2025",
    status: "Bình thường",
    measurements: [
      { name: "Chiều cao", value: "115 cm" },
      { name: "Cân nặng", value: "22 kg" },
      { name: "BMI", value: "16.6" },
      { name: "Thị lực", value: "10/10" },
    ],
    notes: "Sức khỏe tổng quát tốt, phát triển bình thường theo độ tuổi.",
  },
  {
    type: "Khám răng miệng",
    date: "10/05/2025",
    status: "Cần theo dõi",
    measurements: [
      { name: "Răng sữa", value: "18 răng" },
      { name: "Răng vĩnh viễn", value: "2 răng" },
      { name: "Sâu răng", value: "1 răng" },
    ],
    notes: "Phát hiện 1 răng sâu nhẹ, cần điều trị sớm.",
  },
  {
    type: "Khám mắt",
    date: "05/05/2025",
    status: "Bình thường",
    measurements: [
      { name: "Thị lực mắt phải", value: "10/10" },
      { name: "Thị lực mắt trái", value: "10/10" },
      { name: "Nhãn áp", value: "Bình thường" },
    ],
    notes: "Thị lực tốt, không có dấu hiệu bất thường.",
  },
];

const examinationHistory = [
  {
    date: "15/05/2025",
    type: "Khám sức khỏe định kỳ",
    doctor: "BS. Nguyễn Thị Hương",
    result: "Bình thường",
    notes: "Sức khỏe tổng quát tốt, phát triển bình thường theo độ tuổi.",
    location: "Phòng y tế trường Tiểu học Ánh Dương",
    measurements: [
      { name: "Chiều cao", value: "115 cm" },
      { name: "Cân nặng", value: "22 kg" },
      { name: "BMI", value: "16.6" },
      { name: "Thị lực", value: "10/10" },
      { name: "Nhịp tim", value: "85 nhịp/phút" },
      { name: "Huyết áp", value: "90/60 mmHg" },
    ],
    recommendations: "Tiếp tục duy trì chế độ dinh dưỡng và vận động hợp lý.",
    nextAppointment: "15/11/2025",
  },
  {
    date: "10/05/2025",
    type: "Khám răng miệng",
    doctor: "BS. Trần Văn Minh",
    result: "Cần theo dõi",
    notes: "Phát hiện 1 răng sâu nhẹ, cần điều trị sớm.",
    location: "Phòng khám Nha khoa trường Tiểu học Ánh Dương",
    measurements: [
      { name: "Răng sữa", value: "18 răng" },
      { name: "Răng vĩnh viễn", value: "2 răng" },
      { name: "Sâu răng", value: "1 răng" },
      { name: "Cao răng", value: "Nhẹ" },
    ],
    recommendations:
      "Đặt lịch điều trị sâu răng trong vòng 2 tuần. Hướng dẫn vệ sinh răng miệng đúng cách.",
    nextAppointment: "24/05/2025",
  },
  {
    date: "05/05/2025",
    type: "Khám mắt",
    doctor: "BS. Lê Thị Mai",
    result: "Bình thường",
    notes: "Thị lực tốt, không có dấu hiệu bất thường.",
    location: "Phòng khám Mắt trường Tiểu học Ánh Dương",
    measurements: [
      { name: "Thị lực mắt phải", value: "10/10" },
      { name: "Thị lực mắt trái", value: "10/10" },
      { name: "Nhãn áp", value: "Bình thường" },
      { name: "Khô mắt", value: "Không" },
    ],
    recommendations:
      "Hạn chế thời gian sử dụng thiết bị điện tử, đảm bảo ánh sáng phù hợp khi đọc sách.",
    nextAppointment: "05/11/2025",
  },
  {
    date: "01/04/2025",
    type: "Khám sức khỏe định kỳ",
    doctor: "BS. Nguyễn Thị Hương",
    result: "Bình thường",
    notes: "Phát triển tốt, cần bổ sung vitamin D.",
    location: "Phòng y tế trường Tiểu học Ánh Dương",
    measurements: [
      { name: "Chiều cao", value: "114 cm" },
      { name: "Cân nặng", value: "21.5 kg" },
      { name: "BMI", value: "16.5" },
      { name: "Thị lực", value: "10/10" },
      { name: "Nhịp tim", value: "88 nhịp/phút" },
    ],
    recommendations: "Bổ sung vitamin D, tăng cường hoạt động ngoài trời.",
    nextAppointment: "01/10/2025",
  },
  {
    date: "15/01/2025",
    type: "Khám tim mạch",
    doctor: "BS. Phạm Văn Đức",
    result: "Bình thường",
    notes: "Tim mạch hoạt động bình thường, nhịp tim đều.",
    location: "Bệnh viện Nhi Trung ương",
    measurements: [
      { name: "Nhịp tim", value: "86 nhịp/phút" },
      { name: "Huyết áp", value: "90/60 mmHg" },
      { name: "ECG", value: "Bình thường" },
    ],
    recommendations: "Tiếp tục theo dõi định kỳ mỗi 6 tháng.",
    nextAppointment: "15/07/2025",
  },
];

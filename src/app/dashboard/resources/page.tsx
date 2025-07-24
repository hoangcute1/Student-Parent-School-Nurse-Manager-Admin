"use client";
import {
  Calendar,
  Download,
  Filter,
  Search,
  FileText,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useParentStudentsStore } from "@/stores/parent-students-store";
import { useEffect, useState } from "react";
import { getParentId } from "@/lib/utils/parent-utils";
import { getTreatmentHistoryByParentId } from "@/lib/api/treatment-history";
import { TreatmentHistory } from "@/lib/type/treatment-history";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStaffStore } from "@/stores/staff-store";
import { Staff } from "@/lib/type/staff";

export default function MedicalHistoryPage() {
  const {
    fetchStudentsByParent,
    studentsData,
    isLoading: studentsLoading,
    error: studentsError,
    selectedStudentId,
    setSelectedStudentId,
  } = useParentStudentsStore();
  const { staffs, fetchStaffs } = useStaffStore();
  // State để lưu treatment history
  const [treatmentHistory, setTreatmentHistory] = useState<TreatmentHistory[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tự động set học sinh đầu tiên khi có dữ liệu
  useEffect(() => {
    if (studentsData.length > 0 && !selectedStudentId) {
      setSelectedStudentId(studentsData[0].student._id);
    }
  }, [studentsData, selectedStudentId, setSelectedStudentId]);

  useEffect(() => {
    fetchStudentsByParent();
  }, [fetchStudentsByParent]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parentId = await getParentId();
        if (parentId) {
          setLoading(true);
          setError(null);
          const treatmentData = await getTreatmentHistoryByParentId(parentId);
          setTreatmentHistory(treatmentData);
          console.log("Fetched treatmentHistory:", treatmentData);
        } else {
          setError("Không tìm thấy thông tin phụ huynh.");
        }
      } catch (error) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchStudentsByParent]);

  useEffect(() => {
    fetchStaffs();
  }, [fetchStaffs]);

  // Lọc lịch sử bệnh án theo học sinh được chọn (kiểm tra kỹ kiểu dữ liệu)
  const filteredHistory = selectedStudentId
    ? treatmentHistory.filter(
        (entry) =>
          entry.student &&
          typeof entry.student === "object" &&
          entry.student._id === selectedStudentId
      )
    : treatmentHistory;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStudentName = (student: any) => {
    if (typeof student === "string") return student;
    if (typeof student === "object" && student?.name) return student.name;
    return "N/A";
  };

  // Helper để parse notes dạng kỹ thuật
  const parseTechnicalNotes = (notes: string) => {
    if (!notes) return null;
    // Kiểm tra có phải dạng kỹ thuật không
    if (!notes.includes("Title:") || !notes.includes("Location:")) return null;
    const fields = notes.split("|").map((item) => item.trim());
    const result: Record<string, string> = {};
    fields.forEach((field) => {
      const [key, ...rest] = field.split(":");
      if (key && rest.length > 0) {
        result[key.trim()] = rest.join(":").trim();
      }
    });
    return result;
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col space-y-2 items-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Y tế học đường
          </h1>
          <p className="text-sky-500">Đang tải dữ liệu, vui lòng chờ...</p>
        </div>
      </div>
    );
  }

  // Hiển thị error
  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Tài nguyên phụ huynh
          </h1>
          <p className="text-blue-600">Theo dõi lịch sử bệnh án của học sinh</p>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Tài nguyên phụ huynh
        </h1>
        <p className="text-blue-600">Theo dõi lịch sử bệnh án của học sinh</p>
      </div>
      {/* Dropdown chọn học sinh */}
      {studentsData.length > 1 && (
        <div className="mb-4">
          <Select
            value={selectedStudentId}
            onValueChange={setSelectedStudentId}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Chọn học sinh" />
            </SelectTrigger>
            <SelectContent>
              {studentsData.map((stu) => (
                <SelectItem key={stu.student._id} value={stu.student._id}>
                  {stu.student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-800">Lịch sử bệnh án</CardTitle>
              <CardDescription className="text-blue-600">
                Theo dõi toàn bộ lịch sử bệnh án và điều trị của học sinh
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm bệnh án..."
                  className="w-[300px] pl-8 border-blue-200 focus:border-blue-500"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                Xuất lịch sử
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có lịch sử bệnh án nào
            </div>
          ) : (
            <div className="space-y-10">
              {filteredHistory.map((entry, index) => (
                <div key={entry._id} className="relative">
                  {index !== filteredHistory.length - 1 && (
                    <div className="absolute left-7 top-14 h-full w-0.5 bg-gradient-to-b from-blue-200 to-blue-50 z-0"></div>
                  )}
                  <div className="flex gap-4 items-start">
                    <div className="flex flex-col items-center z-10">
                      <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-400 shadow-md">
                        <FileText className="h-7 w-7 text-blue-600" />
                      </div>
                      {index !== filteredHistory.length - 1 && (
                        <div className="flex-1 w-1 bg-gradient-to-b from-blue-200 to-blue-50"></div>
                      )}
                    </div>
                    <Card className="flex-1 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white/90 backdrop-blur-md">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                              <FileText className="h-6 w-6 text-blue-500" />
                              {typeof entry.record === "string"
                                ? entry.record
                                : entry.record &&
                                  typeof entry.record === "object" &&
                                  (entry.record as any).name
                                ? (entry.record as any).name
                                : entry.record &&
                                  typeof entry.record === "object" &&
                                  (entry.record as any)._id
                                ? (entry.record as any)._id
                                : "Bệnh án y tế"}
                            </CardTitle>
                            <CardDescription className="flex flex-wrap items-center gap-3 text-blue-700 mt-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(
                                  entry.date || entry.createdAt || ""
                                )}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {getStudentName(entry.student)}
                              </span>
                              {entry.staff && (
                                <span className="flex items-center gap-1">
                                  <User className="h-4 w-4 text-blue-400" />
                                  {(() => {
                                    if (
                                      typeof entry.staff === "object" &&
                                      entry.staff !== null
                                    ) {
                                      const staffObj = (staffs as Staff[]).find(
                                        (s) => s._id === entry.staff
                                      );
                                      return (
                                        staffObj?.profile?.name ||
                                        staffObj?.user?.email ||
                                        "Không rõ"
                                      );
                                    }
                                    if (typeof entry.staff === "string") {
                                      const staffObj = staffs.find(
                                        (s) => s._id === entry.staff
                                      );
                                      return (
                                        staffObj?.profile?.name ||
                                        staffObj?.user?.email ||
                                        "Không rõ"
                                      );
                                    }
                                    return "Không rõ";
                                  })()}
                                </span>
                              )}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 font-semibold px-3 py-1 rounded-full shadow-sm"
                            >
                              Bệnh án
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-blue-800 text-base font-medium bg-blue-50 rounded-lg p-3 shadow-inner">
                            {entry.description}
                          </p>
                          {entry.notes
                            ? (() => {
                                const parsed = parseTechnicalNotes(
                                  entry.notes!
                                );
                                if (parsed) {
                                  return (
                                    <div>
                                      <label className="text-sm font-semibold text-blue-700">
                                        Ghi chú:
                                      </label>
                                      <div className="text-blue-900 mt-1 p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg whitespace-pre-line shadow-inner space-y-1">
                                        <div>
                                          <span className="font-semibold">
                                            Tiêu đề:
                                          </span>{" "}
                                          {parsed["Title"]}
                                        </div>
                                        <div>
                                          <span className="font-semibold">
                                            Địa điểm:
                                          </span>{" "}
                                          {parsed["Location"]}
                                        </div>
                                        <div>
                                          <span className="font-semibold">
                                            Mức độ ưu tiên:
                                          </span>{" "}
                                          {parsed["Priority"]}
                                        </div>
                                        <div>
                                          <span className="font-semibold">
                                            Lớp:
                                          </span>{" "}
                                          {parsed["Class"]}
                                        </div>
                                        <div>
                                          <span className="font-semibold">
                                            Trạng thái liên hệ:
                                          </span>{" "}
                                          {parsed["Contact Status"]}
                                        </div>
                                        {parsed["Ghi chú khẩn cấp"] && (
                                          <div className="mt-2">
                                            <span className="font-semibold text-red-700">
                                              Ghi chú khẩn cấp:
                                            </span>{" "}
                                            {parsed["Ghi chú khẩn cấp"]}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div>
                                      <label className="text-sm font-semibold text-blue-700">
                                        Ghi chú:
                                      </label>
                                      <div className="text-blue-900 mt-1 p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg whitespace-pre-line shadow-inner">
                                        {entry.notes}
                                      </div>
                                    </div>
                                  );
                                }
                              })()
                            : null}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

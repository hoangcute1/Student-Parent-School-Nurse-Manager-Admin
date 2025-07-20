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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MedicalHistoryPage() {
  const { fetchStudentsByParent, studentsData, isLoading: studentsLoading, error: studentsError, selectedStudentId, setSelectedStudentId } = useParentStudentsStore();
  // State để lưu treatment history
  const [treatmentHistory, setTreatmentHistory] = useState<TreatmentHistory[]>([]);
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

  // Hiển thị loading
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Tài nguyên phụ huynh
          </h1>
          <p className="text-blue-600">
            Theo dõi lịch sử bệnh án của học sinh
          </p>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="text-blue-600">Đang tải dữ liệu...</div>
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
          <p className="text-blue-600">
            Theo dõi lịch sử bệnh án của học sinh
          </p>
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
        <p className="text-blue-600">
          Theo dõi lịch sử bệnh án của học sinh
        </p>
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
              <CardTitle className="text-blue-800">
                Lịch sử bệnh án
              </CardTitle>
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
            <div className="space-y-6">
              {filteredHistory.map((entry, index) => (
                <div key={entry._id} className="relative">
                  {index !== filteredHistory.length - 1 && (
                    <div className="absolute left-6 top-12 h-full w-0.5 bg-blue-200"></div>
                  )}
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <Card className="flex-1 border-blue-100 hover:border-blue-300 transition-all duration-300">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-blue-800">
                              {entry.record || "Bệnh án y tế"}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 text-blue-600">
                              <Calendar className="h-4 w-4" />
                              {formatDate(entry.date || entry.createdAt || "")}
                              <span>•</span>
                              <User className="h-4 w-4" />
                              {getStudentName(entry.student)}
                              {entry.staff && (
                                <>
                                  <span>•</span>
                                  <span>Nhân viên: {typeof entry.staff === 'string' ? entry.staff : 'N/A'}</span>
                                </>
                              )}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Bệnh án
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-blue-700">
                            {entry.description}
                          </p>

                          {entry.notes && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Ghi chú:</label>
                              <div className="text-gray-900 mt-1 p-3 bg-blue-50 rounded-md whitespace-pre-line">
                                {entry.notes.includes('||')
                                  ? entry.notes.split('||').map((line, idx) => <div key={idx}>{line.trim()}</div>)
                                  : entry.notes}
                              </div>
                            </div>
                          )}
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

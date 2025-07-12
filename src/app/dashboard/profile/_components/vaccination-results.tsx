"use client";

import {
  Syringe,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  AlertTriangle,
  Download,
  Filter,
  Search,
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
import { useParentStudentsStore } from "@/stores/parent-students-store";
import { fetchData } from "@/lib/api/api";
import { toast } from "sonner";

interface VaccinationResult {
  _id: string;
  title: string;
  vaccination_date: string;
  vaccination_time: string;
  location?: string;
  doctor_name?: string;
  vaccine_type?: string;
  vaccination_result?: string;
  vaccination_notes?: string;
  recommendations?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
  student: {
    _id: string;
    name: string;
    student_id: string;
  };
  created_at: string;
}

interface VaccinationResultDetail {
  reaction?: string;
  injection_site?: string;
  reaction_severity?: string;
  adverse_events?: string;
  postVaccinationMonitoring?: string;
  type?: string;
}

export default function VaccinationResults() {
  const { selectedStudent } = useParentStudentsStore();
  const [results, setResults] = useState<VaccinationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResult, setSelectedResult] =
    useState<VaccinationResult | null>(null);

  useEffect(() => {
    fetchVaccinationResults();
  }, [selectedStudent]);

  const fetchVaccinationResults = async () => {
    if (!selectedStudent) return;

    try {
      setLoading(true);
      const results = await fetchData<VaccinationResult[]>(
        `/vaccination-schedules/results/student/${selectedStudent.student._id}`
      );
      setResults(
        results.sort(
          (a, b) =>
            new Date(b.vaccination_date).getTime() -
            new Date(a.vaccination_date).getTime()
        )
      );
    } catch (error) {
      console.error("Error fetching vaccination results:", error);
      toast.error("Không thể tải kết quả tiêm chủng");
    } finally {
      setLoading(false);
    }
  };

  const parseVaccinationResult = (
    resultString: string
  ): VaccinationResultDetail => {
    try {
      return JSON.parse(resultString);
    } catch {
      return {};
    }
  };

  const getReactionSeverityBadge = (severity: string) => {
    switch (severity) {
      case "none":
        return <Badge className="bg-green-100 text-green-800">Không có</Badge>;
      case "mild":
        return <Badge className="bg-yellow-100 text-yellow-800">Nhẹ</Badge>;
      case "moderate":
        return <Badge className="bg-orange-100 text-orange-800">Vừa</Badge>;
      case "severe":
        return <Badge className="bg-red-100 text-red-800">Nặng</Badge>;
      default:
        return <Badge variant="outline">Chưa xác định</Badge>;
    }
  };

  const getReactionLabel = (reaction: string) => {
    const reactionMap: { [key: string]: string } = {
      normal: "Bình thường",
      mild_pain: "Đau nhẹ tại chỗ tiêm",
      swelling: "Sưng tại chỗ tiêm",
      fever: "Sốt nhẹ",
      allergic: "Phản ứng dị ứng",
      other: "Khác",
    };
    return reactionMap[reaction] || reaction;
  };

  const getInjectionSiteLabel = (site: string) => {
    const siteMap: { [key: string]: string } = {
      left_arm: "Cánh tay trái",
      right_arm: "Cánh tay phải",
      left_thigh: "Đùi trái",
      right_thigh: "Đùi phải",
    };
    return siteMap[site] || site;
  };

  const filteredResults = results.filter(
    (result) =>
      result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (result.vaccine_type &&
        result.vaccine_type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Hiển thị thông báo nếu không có học sinh nào được chọn
  if (!selectedStudent) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Kết quả tiêm chủng
          </h1>
          <p className="text-blue-600">
            Xem kết quả tiêm chủng và theo dõi lịch sử tiêm của học sinh.
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-blue-600">Đang tải kết quả tiêm chủng...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Kết quả tiêm chủng - {selectedStudent.student.name}
        </h1>
        <p className="text-blue-600">
          Xem kết quả tiêm chủng và theo dõi lịch sử tiêm của học sinh.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên vắc-xin, học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="text-center py-8">
          <Syringe className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Chưa có kết quả tiêm chủng
          </h3>
          <p className="text-gray-500">
            Kết quả tiêm chủng sẽ được cập nhật sau khi hoàn thành tiêm.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((result) => {
            const vaccinationDetail = result.vaccination_result
              ? parseVaccinationResult(result.vaccination_result)
              : {};

            return (
              <Card
                key={result._id}
                className="border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Syringe className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg text-blue-800">
                        {result.title}
                      </CardTitle>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Hoàn thành
                    </Badge>
                  </div>
                  <CardDescription className="text-blue-600">
                    Ngày tiêm:{" "}
                    {new Date(result.vaccination_date).toLocaleDateString(
                      "vi-VN"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Loại vắc-xin:</span>
                      <span className="font-semibold text-blue-800">
                        {result.vaccine_type || "Không xác định"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Địa điểm:</span>
                      <span className="font-semibold text-blue-800">
                        {result.location || "Không xác định"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bác sĩ:</span>
                      <span className="font-semibold text-blue-800">
                        {(() => {
                          // Try to get doctor name from vaccination_result JSON first
                          if (result.vaccination_result) {
                            try {
                              const parsedResult = JSON.parse(
                                result.vaccination_result
                              );
                              if (parsedResult.doctor_name) {
                                return parsedResult.doctor_name;
                              }
                            } catch (error) {
                              console.error(
                                "Error parsing vaccination result:",
                                error
                              );
                            }
                          }
                          // Fallback to result.doctor_name
                          return (
                            result.doctor_name || "Bác sĩ phụ trách sự kiện"
                          );
                        })()}
                      </span>
                    </div>
                    {vaccinationDetail.postVaccinationMonitoring && (
                      <div className="text-xs text-gray-500 mt-2">
                        {vaccinationDetail.postVaccinationMonitoring}
                      </div>
                    )}
                  </div>
                </CardContent>
                <div className="px-6 pb-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedResult(result)}
                      >
                        Xem chi tiết
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Syringe className="w-5 h-5" />
                          Chi tiết kết quả tiêm chủng
                        </DialogTitle>
                        <DialogDescription>
                          {result.student.name} - {result.title}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Ngày tiêm
                            </label>
                            <p className="text-sm">
                              {new Date(
                                result.vaccination_date
                              ).toLocaleDateString("vi-VN")}{" "}
                              lúc {result.vaccination_time}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Loại vắc-xin
                            </label>
                            <p className="text-sm">
                              {result.vaccine_type || "Không xác định"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Địa điểm tiêm
                            </label>
                            <p className="text-sm">
                              {result.location || "Không xác định"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Bác sĩ phụ trách
                            </label>
                            <p className="text-sm">
                              {(() => {
                                // Try to get doctor name from vaccination_result JSON first
                                if (result.vaccination_result) {
                                  try {
                                    const parsedResult = JSON.parse(
                                      result.vaccination_result
                                    );
                                    if (parsedResult.doctor_name) {
                                      return parsedResult.doctor_name;
                                    }
                                  } catch (error) {
                                    console.error(
                                      "Error parsing vaccination result:",
                                      error
                                    );
                                  }
                                }
                                // Fallback to result.doctor_name
                                return (
                                  result.doctor_name ||
                                  "Bác sĩ phụ trách sự kiện"
                                );
                              })()}
                            </p>
                          </div>
                        </div>

                        {/* Theo dõi sau tiêm */}
                        {vaccinationDetail.postVaccinationMonitoring && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Theo dõi sau tiêm
                            </label>
                            <p className="text-sm bg-blue-50 p-3 rounded-md">
                              {vaccinationDetail.postVaccinationMonitoring}
                            </p>
                          </div>
                        )}

                        {/* Khuyến nghị */}
                        {result.recommendations && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Khuyến nghị
                            </label>
                            <p className="text-sm bg-green-50 p-3 rounded-md">
                              {result.recommendations}
                            </p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

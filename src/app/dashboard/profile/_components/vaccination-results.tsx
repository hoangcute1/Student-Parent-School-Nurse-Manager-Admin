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
  type?: string;
}

export default function VaccinationResults() {
  const { studentsData } = useParentStudentsStore();
  const [results, setResults] = useState<VaccinationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResult, setSelectedResult] =
    useState<VaccinationResult | null>(null);

  useEffect(() => {
    fetchVaccinationResults();
  }, [studentsData]);

  const fetchVaccinationResults = async () => {
    if (!studentsData || studentsData.length === 0) return;

    try {
      setLoading(true);
      const allResults: VaccinationResult[] = [];

      for (const student of studentsData) {
        try {
          // TODO: Replace with actual API endpoint for vaccination results
          const studentResults = await fetchData<VaccinationResult[]>(
            `/vaccination-schedules/results/student/${student.student._id}`
          );
          allResults.push(...studentResults);
        } catch (error) {
          console.error(
            `Error fetching vaccination results for student ${student.student._id}:`,
            error
          );
        }
      }

      setResults(
        allResults.sort(
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-blue-600">Đang tải kết quả tiêm chủng...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Syringe className="h-5 w-5 text-blue-600" />
                Kết quả tiêm chủng
              </CardTitle>
              <CardDescription>
                Xem lịch sử và kết quả tiêm chủng của con em
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Lọc
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thông tin tiêm chủng</TableHead>
                  <TableHead>Học sinh</TableHead>
                  <TableHead>Ngày tiêm</TableHead>
                  <TableHead>Phản ứng</TableHead>
                  <TableHead>Theo dõi</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => {
                  const vaccinationDetail = result.vaccination_result
                    ? parseVaccinationResult(result.vaccination_result)
                    : {};

                  return (
                    <TableRow key={result._id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{result.title}</div>
                          {result.vaccine_type && (
                            <div className="text-sm text-blue-600">
                              {result.vaccine_type}
                            </div>
                          )}
                          {result.location && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {result.location}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {result.student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {result.student.student_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3" />
                            {new Date(
                              result.vaccination_date
                            ).toLocaleDateString("vi-VN")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {result.vaccination_time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {vaccinationDetail.reaction_severity ? (
                          <div className="space-y-1">
                            {getReactionSeverityBadge(
                              vaccinationDetail.reaction_severity
                            )}
                            {vaccinationDetail.reaction && (
                              <div className="text-xs text-gray-600">
                                {getReactionLabel(vaccinationDetail.reaction)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Chưa cập nhật</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.follow_up_required ? (
                          <div className="space-y-1">
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Cần theo dõi
                            </Badge>
                            {result.follow_up_date && (
                              <div className="text-xs text-gray-600">
                                Hẹn:{" "}
                                {new Date(
                                  result.follow_up_date
                                ).toLocaleDateString("vi-VN")}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Hoàn thành
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
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
                                    Bác sĩ thực hiện
                                  </label>
                                  <p className="text-sm">
                                    {result.doctor_name || "Không xác định"}
                                  </p>
                                </div>
                              </div>

                              {/* Vaccination Details */}
                              {vaccinationDetail.injection_site && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">
                                      Vị trí tiêm
                                    </label>
                                    <p className="text-sm">
                                      {getInjectionSiteLabel(
                                        vaccinationDetail.injection_site
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">
                                      Phản ứng sau tiêm
                                    </label>
                                    <p className="text-sm">
                                      {vaccinationDetail.reaction
                                        ? getReactionLabel(
                                            vaccinationDetail.reaction
                                          )
                                        : "Bình thường"}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Adverse Events */}
                              {vaccinationDetail.adverse_events && (
                                <div>
                                  <label className="text-sm font-medium text-gray-500">
                                    Biến cố bất lợi
                                  </label>
                                  <p className="text-sm bg-red-50 p-3 rounded-md">
                                    {vaccinationDetail.adverse_events}
                                  </p>
                                </div>
                              )}

                              {/* Notes and Recommendations */}
                              {result.vaccination_notes && (
                                <div>
                                  <label className="text-sm font-medium text-gray-500">
                                    Ghi chú tiêm chủng
                                  </label>
                                  <p className="text-sm bg-blue-50 p-3 rounded-md">
                                    {result.vaccination_notes}
                                  </p>
                                </div>
                              )}

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

                              {/* Follow-up */}
                              {result.follow_up_required && (
                                <div className="bg-yellow-50 p-4 rounded-md">
                                  <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                    <span className="font-medium text-yellow-800">
                                      Cần theo dõi thêm
                                    </span>
                                  </div>
                                  {result.follow_up_date && (
                                    <p className="text-sm text-yellow-700 mt-1">
                                      Ngày hẹn tái khám:{" "}
                                      {new Date(
                                        result.follow_up_date
                                      ).toLocaleDateString("vi-VN")}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

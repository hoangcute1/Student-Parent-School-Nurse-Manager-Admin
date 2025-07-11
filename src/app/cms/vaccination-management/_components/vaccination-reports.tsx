"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Calendar,
  Search,
  Filter,
} from "lucide-react";

interface VaccinationReport {
  id: string;
  scheduleName: string;
  vaccine: string;
  targetGroup: string;
  planDate: string;
  actualDate?: string;
  totalStudents: number;
  agreedStudents: number;
  declinedStudents: number;
  pendingStudents: number;
  completedVaccinations: number;
  contraindicationCount: number;
  responseRate: number;
  completionRate: number;
  status: "planned" | "in-progress" | "completed" | "cancelled";
}

interface VaccinationReportsProps {
  onClose: () => void;
}

// Mock data - sẽ được thay thế bằng API calls
const mockReports: VaccinationReport[] = [];

export function VaccinationReports({ onClose }: VaccinationReportsProps) {
  const [reports] = useState<VaccinationReport[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPeriod, setFilterPeriod] = useState<string>("this-month");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-blue-100 text-blue-800">Đang thực hiện</Badge>
        );
      case "planned":
        return (
          <Badge className="bg-gray-100 text-gray-800">Đã lên kế hoạch</Badge>
        );
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.scheduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.vaccine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Tính toán thống kê tổng hợp
  const totalSchedules = reports.length;
  const completedSchedules = reports.filter(
    (r) => r.status === "completed"
  ).length;
  const totalStudents = reports.reduce((sum, r) => sum + r.totalStudents, 0);
  const totalCompleted = reports.reduce(
    (sum, r) => sum + r.completedVaccinations,
    0
  );
  const avgCompletionRate =
    reports
      .filter((r) => r.status === "completed")
      .reduce((sum, r) => sum + r.completionRate, 0) /
    (reports.filter((r) => r.status === "completed").length || 1);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <BarChart3 className="w-5 h-5" />
              Báo cáo tiêm chủng
            </CardTitle>
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </CardHeader>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-6">
            {/* Filters và Actions */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm lịch tiêm, vaccine..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="planned">Đã lên kế hoạch</SelectItem>
                    <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-40">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-week">Tuần này</SelectItem>
                    <SelectItem value="this-month">Tháng này</SelectItem>
                    <SelectItem value="this-quarter">Quý này</SelectItem>
                    <SelectItem value="this-year">Năm này</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>

            {/* Thống kê tổng hợp */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">
                      {totalSchedules}
                    </div>
                    <div className="text-sm text-gray-600">Tổng lịch tiêm</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-green-600">
                      {completedSchedules}
                    </div>
                    <div className="text-sm text-gray-600">Đã hoàn thành</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-purple-600">
                      {totalStudents}
                    </div>
                    <div className="text-sm text-gray-600">Tổng học sinh</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold text-orange-600">
                      {avgCompletionRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Tỷ lệ hoàn thành TB
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Biểu đồ tổng quan */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tiến độ tiêm chủng theo lịch</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredReports.map((report) => (
                      <div key={report.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">
                            {report.scheduleName}
                          </span>
                          <span>{report.completionRate.toFixed(1)}%</span>
                        </div>
                        <Progress
                          value={report.completionRate}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Phân bố phản hồi phụ huynh</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredReports.map((report) => (
                      <div key={report.id} className="space-y-2">
                        <div className="text-sm font-medium">
                          {report.scheduleName}
                        </div>
                        <div className="flex gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span>Đồng ý: {report.agreedStudents}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            <span>Từ chối: {report.declinedStudents}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                            <span>Chờ: {report.pendingStudents}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 flex">
                          <div
                            className="bg-green-500 h-2 rounded-l-full"
                            style={{
                              width: `${
                                (report.agreedStudents / report.totalStudents) *
                                100
                              }%`,
                            }}
                          ></div>
                          <div
                            className="bg-red-500 h-2"
                            style={{
                              width: `${
                                (report.declinedStudents /
                                  report.totalStudents) *
                                100
                              }%`,
                            }}
                          ></div>
                          <div
                            className="bg-yellow-500 h-2 rounded-r-full"
                            style={{
                              width: `${
                                (report.pendingStudents /
                                  report.totalStudents) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bảng chi tiết */}
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết báo cáo</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lịch tiêm</TableHead>
                      <TableHead>Vaccine</TableHead>
                      <TableHead>Đối tượng</TableHead>
                      <TableHead>Ngày dự kiến</TableHead>
                      <TableHead>Tỷ lệ phản hồi</TableHead>
                      <TableHead>Tỷ lệ hoàn thành</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Chi tiết</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.scheduleName}
                        </TableCell>
                        <TableCell>{report.vaccine}</TableCell>
                        <TableCell>{report.targetGroup}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div>Dự kiến: {report.planDate}</div>
                            {report.actualDate && (
                              <div className="text-sm text-gray-600">
                                Thực tế: {report.actualDate}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {report.responseRate}%
                            </div>
                            <div className="text-xs text-gray-600">
                              {report.totalStudents - report.pendingStudents}/
                              {report.totalStudents}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {report.completionRate.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-600">
                              {report.completedVaccinations}/
                              {report.agreedStudents}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              <span>Đồng ý: {report.agreedStudents}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <XCircle className="w-3 h-3 text-red-600" />
                              <span>Từ chối: {report.declinedStudents}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <AlertTriangle className="w-3 h-3 text-yellow-600" />
                              <span>
                                Chống chỉ định: {report.contraindicationCount}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

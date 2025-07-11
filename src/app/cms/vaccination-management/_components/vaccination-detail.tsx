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
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  className: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  responseStatus: "pending" | "agreed" | "declined";
  responseDate?: string;
  vaccinationStatus?: "not-started" | "completed" | "contraindication";
  notes?: string;
}

interface VaccinationDetailProps {
  scheduleId: string;
  onClose: () => void;
}

// Mock data - sẽ được thay thế bằng API calls
const mockStudents: Student[] = [];

export function VaccinationDetail({
  scheduleId,
  onClose,
}: VaccinationDetailProps) {
  const [students] = useState<Student[]>(mockStudents);
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "responses" | "vaccination"
  >("overview");

  // Thống kê
  const totalStudents = students.length;
  const agreedStudents = students.filter(
    (s) => s.responseStatus === "agreed"
  ).length;
  const declinedStudents = students.filter(
    (s) => s.responseStatus === "declined"
  ).length;
  const pendingStudents = students.filter(
    (s) => s.responseStatus === "pending"
  ).length;
  const completedVaccinations = students.filter(
    (s) => s.vaccinationStatus === "completed"
  ).length;

  const responseRate = (
    ((totalStudents - pendingStudents) / totalStudents) *
    100
  ).toFixed(1);
  const agreementRate = ((agreedStudents / totalStudents) * 100).toFixed(1);

  const getResponseBadge = (status: string) => {
    switch (status) {
      case "agreed":
        return <Badge className="bg-green-100 text-green-800">Đồng ý</Badge>;
      case "declined":
        return <Badge className="bg-red-100 text-red-800">Từ chối</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Chờ phản hồi</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getVaccinationBadge = (status?: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Đã tiêm</Badge>;
      case "contraindication":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            Chống chỉ định
          </Badge>
        );
      case "not-started":
        return <Badge variant="outline">Chưa tiêm</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Calendar className="w-5 h-5" />
              Chi tiết lịch tiêm: Viêm gan B - Khối 1
            </CardTitle>
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </CardHeader>

        <div className="flex h-full">
          {/* Sidebar Navigation */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <nav className="space-y-2">
              <Button
                variant={selectedTab === "overview" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedTab("overview")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Tổng quan
              </Button>
              <Button
                variant={selectedTab === "responses" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedTab("responses")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Phản hồi phụ huynh
              </Button>
              <Button
                variant={selectedTab === "vaccination" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedTab("vaccination")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Thực hiện tiêm
              </Button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedTab === "overview" && (
              <div className="space-y-6">
                {/* Thông tin cơ bản */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin lịch tiêm</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Ngày tiêm:</span>
                        <span>15/07/2025 - 08:00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Địa điểm:</span>
                        <span>Phòng y tế trường</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Đối tượng:</span>
                        <span>Khối 1 (Lớp 1A, 1B)</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Hạn phản hồi:</span>
                        <span>13/07/2025</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Trạng thái:</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          Đã gửi thông báo
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Thống kê tổng quan */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <div className="text-2xl font-bold text-blue-600">
                          {totalStudents}
                        </div>
                        <div className="text-sm text-gray-600">
                          Tổng học sinh
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <div className="text-2xl font-bold text-green-600">
                          {agreedStudents}
                        </div>
                        <div className="text-sm text-gray-600">
                          Đồng ý tham gia
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                        <div className="text-2xl font-bold text-red-600">
                          {declinedStudents}
                        </div>
                        <div className="text-sm text-gray-600">Từ chối</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                        <div className="text-2xl font-bold text-yellow-600">
                          {pendingStudents}
                        </div>
                        <div className="text-sm text-gray-600">
                          Chờ phản hồi
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tiến độ phản hồi */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tiến độ phản hồi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tỷ lệ phản hồi</span>
                        <span>{responseRate}%</span>
                      </div>
                      <Progress
                        value={parseFloat(responseRate)}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tỷ lệ đồng ý</span>
                        <span>{agreementRate}%</span>
                      </div>
                      <Progress
                        value={parseFloat(agreementRate)}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === "responses" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Danh sách phản hồi phụ huynh</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Học sinh</TableHead>
                          <TableHead>Lớp</TableHead>
                          <TableHead>Phụ huynh</TableHead>
                          <TableHead>Liên hệ</TableHead>
                          <TableHead>Phản hồi</TableHead>
                          <TableHead>Ngày phản hồi</TableHead>
                          <TableHead>Ghi chú</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">
                              {student.name}
                            </TableCell>
                            <TableCell>{student.className}</TableCell>
                            <TableCell>{student.parentName}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-sm">
                                  <Phone className="w-3 h-3" />
                                  {student.parentPhone}
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  <Mail className="w-3 h-3" />
                                  {student.parentEmail}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getResponseBadge(student.responseStatus)}
                            </TableCell>
                            <TableCell>{student.responseDate || "-"}</TableCell>
                            <TableCell>{student.notes || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === "vaccination" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thực hiện tiêm chủng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Học sinh</TableHead>
                          <TableHead>Lớp</TableHead>
                          <TableHead>Phản hồi PH</TableHead>
                          <TableHead>Trạng thái tiêm</TableHead>
                          <TableHead>Ghi chú y tế</TableHead>
                          <TableHead>Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students
                          .filter((s) => s.responseStatus === "agreed")
                          .map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">
                                {student.name}
                              </TableCell>
                              <TableCell>{student.className}</TableCell>
                              <TableCell>
                                {getResponseBadge(student.responseStatus)}
                              </TableCell>
                              <TableCell>
                                {getVaccinationBadge(student.vaccinationStatus)}
                              </TableCell>
                              <TableCell>{student.notes || "-"}</TableCell>
                              <TableCell>
                                {student.vaccinationStatus ===
                                  "not-started" && (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Đã tiêm
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      Chống chỉ định
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

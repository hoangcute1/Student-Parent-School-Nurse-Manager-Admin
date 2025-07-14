"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Clock,
  Send,
  Edit,
  Eye,
  Trash2,
} from "lucide-react";
import { useVaccineCampaignStore } from "@/stores/vaccine-campaign-store";
import { useAuthStore } from "@/stores/auth-store";

interface VaccineCampaign {
  _id: string;
  vaccine: {
    _id: string;
    name: string;
    dosage: string;
  };
  place: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  staff: {
    _id: string;
    name: string;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ExtendedVaccineCampaign extends VaccineCampaign {
  // Extended properties for UI display
  gradeLevel?: string;
  className?: string;
  totalStudents?: number;
  respondedStudents?: number;
  agreedStudents?: number;
  completedStudents?: number;
}
  XCircle,
  Eye,
  Edit,
  Trash2,
  Send,
} from "lucide-react";
import { useVaccineCampaignStore } from "@/stores/vaccine-campaign-store";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface VaccinationSchedule {
  id: string;
  vaccineName: string;
  gradeLevel: string;
  className?: string;
  date: string;
  time: string;
  location: string;
  status: "draft" | "sent" | "in-progress" | "completed";
  totalStudents: number;
  respondedStudents: number;
  agreedStudents: number;
  completedStudents: number;
  createdBy: string;
  createdAt: string;
}

// Mock data - sẽ được thay thế bằng API calls
const mockSchedules: VaccinationSchedule[] = [];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Badge variant="secondary">Chờ phê duyệt</Badge>;
    case "ACTIVE":
      return (
        <Badge className="bg-blue-100 text-blue-800">Đang tiến hành</Badge>
      );
    case "COMPLETED":
      return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
    case "CANCELLED":
      return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

interface VaccinationListProps {
  filter?: "all" | "my";
  refreshKey?: number;
  onViewDetail?: (scheduleId: string) => void;
}

export function VaccinationList({
  filter = "all",
  refreshKey,
  onViewDetail,
}: VaccinationListProps) {
  // Zustand stores
  const { campaigns, myCampaigns, loading, fetchAllCampaigns, fetchMyCampaigns } = useVaccineCampaignStore();
  const { user } = useAuthStore();

  // Load campaigns when component mounts or refreshKey changes
  useEffect(() => {
    if (filter === "all") {
      fetchAllCampaigns();
    } else if (filter === "my" && user) {
      // TODO: Get actual staff ID from user profile
      fetchMyCampaigns("current-staff-id");
    }
  }, [filter, refreshKey, fetchAllCampaigns, fetchMyCampaigns, user]);

  const filteredSchedules = filter === "my" ? myCampaigns : campaigns;

  return (
    <div className="space-y-6">
      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng lịch tiêm</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredSchedules.length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang chờ phản hồi</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredSchedules.filter((s) => s.status === "PENDING").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    filteredSchedules.filter((s) => s.status === "COMPLETED")
                      .length
                  }
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng học sinh</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredSchedules.reduce(
                    (sum, s) => sum + (s.totalStudents || 0),
                    0
                  )}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danh sách lịch tiêm */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {filter === "my" ? "Lịch tiêm của tôi" : "Tất cả lịch tiêm"}
            <Badge variant="outline" className="ml-2">
              {filteredSchedules.length} lịch tiêm
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSchedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Chưa có lịch tiêm nào</p>
              <p className="text-sm">Tạo lịch tiêm đầu tiên để bắt đầu</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vaccine</TableHead>
                    <TableHead>Đối tượng</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Địa điểm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Tiến độ</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => (
                    <TableRow key={schedule._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{schedule.vaccine.name}</p>
                          <p className="text-sm text-gray-500">
                            Tạo bởi {schedule.staff?.name || "N/A"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{schedule.gradeLevel}</p>
                          {schedule.className && (
                            <p className="text-sm text-gray-500">
                              {schedule.className}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-1">
                            <Users className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {schedule.totalStudents || 0} học sinh
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm">{new Date(schedule.startDate).toLocaleDateString('vi-VN')}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(schedule.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{schedule.place}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {schedule.status !== "PENDING" && (
                            <>
                              <div className="flex items-center gap-2 text-sm">
                                <div className="w-16 text-gray-500">
                                  Phản hồi:
                                </div>
                                <div className="font-medium">
                                  {schedule.respondedStudents || 0}/
                                  {schedule.totalStudents || 0}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <div className="w-16 text-gray-500">
                                  Đồng ý:
                                </div>
                                <div className="font-medium text-green-600">
                                  {schedule.agreedStudents || 0}
                                </div>
                              </div>
                              {schedule.status === "COMPLETED" && (
                                <div className="flex items-center gap-2 text-sm">
                                  <div className="w-16 text-gray-500">
                                    Đã tiêm:
                                  </div>
                                  <div className="font-medium text-blue-600">
                                    {schedule.completedStudents || 0}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => onViewDetail?.(schedule._id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {schedule.status === "PENDING" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

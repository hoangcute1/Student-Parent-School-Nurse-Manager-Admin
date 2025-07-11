"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useVaccinationStore } from "@/stores/vaccination-store";

interface VaccinationEvent {
  _id: string;
  title: string;
  description: string;
  vaccination_date: string;
  vaccination_time: string;
  location?: string;
  doctor_name?: string;
  vaccine_type?: string;
  grade_levels: number[];
  total_students: number;
  approved_count: number;
  pending_count: number;
  rejected_count: number;
  completed_count: number;
  classes: any[];
}

export function VaccinationList() {
  const { events, loading, error, fetchEvents } = useVaccinationStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events;

  return (
    <div className="space-y-6">
      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng sự kiện</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredEvents.length}
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
                <p className="text-sm text-gray-600">Chờ phản hồi</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredEvents.reduce((sum, e) => sum + e.pending_count, 0)}
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
                  {filteredEvents.reduce(
                    (sum, e) => sum + e.completed_count,
                    0
                  )}
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
                  {filteredEvents.reduce((sum, e) => sum + e.total_students, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Danh sách sự kiện tiêm chủng */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Sự kiện tiêm chủng
            <Badge variant="outline" className="ml-2">
              {filteredEvents.length} sự kiện
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Đang tải dữ liệu...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Chưa có sự kiện tiêm nào</p>
              <p className="text-sm">Tạo sự kiện đầu tiên để bắt đầu</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Khối lớp</TableHead>
                    <TableHead>Ngày & Giờ</TableHead>
                    <TableHead>Địa điểm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Học sinh</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-500">
                            {event.description?.substring(0, 100)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">
                            {event.grade_levels.length > 0
                              ? `Khối ${event.grade_levels.join(", ")}`
                              : "Cá nhân"}
                          </span>
                          <div className="text-xs text-gray-500">
                            {event.classes.length} lớp
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm">
                              {new Date(
                                event.vaccination_date
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {event.vaccination_time}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {event.pending_count > 0
                            ? `Chờ phản hồi (${event.pending_count})`
                            : event.completed_count > 0
                            ? `Hoàn thành (${event.completed_count})`
                            : event.approved_count > 0
                            ? `Đã đồng ý (${event.approved_count})`
                            : event.rejected_count > 0
                            ? `Từ chối (${event.rejected_count})`
                            : "Không xác định"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {event.total_students} học sinh
                        </span>
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

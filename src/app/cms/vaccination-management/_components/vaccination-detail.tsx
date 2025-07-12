"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  AlertTriangle,
  Syringe,
  User,
  FileText,
} from "lucide-react";
import { useVaccinationStore } from "@/stores/vaccination-store";

interface VaccinationDetailProps {
  eventId: string;
  onClose: () => void;
}

export function VaccinationDetail({
  eventId,
  onClose,
}: VaccinationDetailProps) {
  const { events, loading, error } = useVaccinationStore();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    // Tìm event từ store dựa trên eventId, so sánh dưới dạng string để tránh lỗi
    const foundEvent = events.find((e) => String(e._id) === String(eventId));
    setEvent(foundEvent || null);
  }, [eventId, events]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center text-red-500">
            {error || "Không tìm thấy thông tin sự kiện"}
          </div>
          <Button onClick={onClose} className="mt-4">
            Đóng
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Syringe className="w-5 h-5" />
              Chi tiết sự kiện tiêm chủng
            </CardTitle>
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </CardHeader>
        <div className="p-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Tiêu đề:</span>
              <span className="text-gray-700">{event.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <Syringe className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Loại vắc xin:</span>
              <span className="text-gray-700">
                {event.vaccine_type || "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Khối lớp:</span>
              <span className="text-gray-700">
                {event.grade_levels.length > 0
                  ? `Khối ${event.grade_levels.join(", ")}`
                  : "Cá nhân"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Ngày tiêm:</span>
              <span className="text-gray-700">
                {new Date(event.vaccination_date).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Giờ tiêm:</span>
              <span className="text-gray-700">{event.vaccination_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Địa điểm:</span>
              <span className="text-gray-700">
                {event.location || "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Bác sĩ phụ trách:</span>
              <span className="text-gray-700">
                {event.doctor_name || "Chưa phân công"}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Ghi chú & Hướng dẫn:</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {event.description || "Chưa có mô tả hoặc hướng dẫn"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

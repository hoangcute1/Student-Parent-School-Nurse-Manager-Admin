"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, User, MapPin, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParentStudentsStore } from "@/stores/parent-students-store";
import { createNotification } from "@/lib/api/notification";

interface ConsultationAppointment {
  _id: string;
  parent: string;
  student: {
    _id: string;
    name: string;
    studentId: string;
  };
  content: string;
  notes: string;
  type: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ConsultationAppointments() {
  const [consultations, setConsultations] = useState<ConsultationAppointment[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const { studentsData } = useParentStudentsStore();

  useEffect(() => {
    fetchConsultationAppointments();
  }, [studentsData]);

  const fetchConsultationAppointments = async () => {
    try {
      setLoading(true);

      // Lấy tất cả notifications của phụ huynh
      const response = await fetch("/api/notifications/parent/current");
      if (!response.ok) {
        throw new Error("Failed to fetch consultations");
      }

      const allNotifications = await response.json();

      // Lọc ra các notification có type là CONSULTATION_APPOINTMENT
      const consultationNotifications = allNotifications.filter(
        (notification: any) => notification.type === "CONSULTATION_APPOINTMENT"
      );

      setConsultations(consultationNotifications);
    } catch (error) {
      console.error("Error fetching consultation appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (consultationId: string) => {
    try {
      // TODO: Implement mark as read functionality
      console.log("Marking consultation as read:", consultationId);
    } catch (error) {
      console.error("Error marking consultation as read:", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải lịch hẹn tư vấn...</p>
        </CardContent>
      </Card>
    );
  }

  if (consultations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Lịch hẹn tư vấn
          </h2>
          <p className="text-gray-500">Hiện tại chưa có lịch hẹn tư vấn nào.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Calendar className="w-5 h-5" />
            Lịch hẹn tư vấn ({consultations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <Card
                key={consultation._id}
                className="border-l-4 border-l-blue-500"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-blue-800 mb-1">
                        {consultation.content}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>
                            Học sinh:{" "}
                            {consultation.student?.name || "Không xác định"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            Ngày tạo:{" "}
                            {new Date(
                              consultation.createdAt
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!consultation.isRead && (
                        <Badge className="bg-red-500 text-white text-xs">
                          Mới
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(consultation._id)}
                      >
                        Đánh dấu đã đọc
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Chi tiết lịch hẹn:
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-line">
                      {consultation.notes}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

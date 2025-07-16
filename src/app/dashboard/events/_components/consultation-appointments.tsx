"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  FileText,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/lib/api/api";
import { useParentStudentsStore } from "@/stores/parent-students-store";

interface ConsultationAppointment {
  _id: string;
  consultation_title: string;
  consultation_date: string;
  consultation_time: string;
  consultation_doctor: string;
  consultation_notes: string;
  student: {
    _id: string;
    full_name: string;
    student_id: string;
    email?: string;
    phone?: string;
  };
  original_examination: {
    title: string;
    examination_date: string;
    examination_type: string;
    status: string;
  };
  created_by: {
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export default function ConsultationAppointments() {
  const { selectedStudent } = useParentStudentsStore();
  const [consultations, setConsultations] = useState<ConsultationAppointment[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultationAppointments();
    // eslint-disable-next-line
  }, [selectedStudent]); // Lắng nghe selectedStudent

  const fetchConsultationAppointments = async () => {
    try {
      setLoading(true);
      let url = "/health-examinations/consultations";
      if (selectedStudent && selectedStudent.student?._id) {
        url += `?studentId=${selectedStudent.student._id}`;
      }
      const response = await fetchData<ConsultationAppointment[]>(url);
      setConsultations(response || []);
    } catch (error) {
      console.error("Error fetching consultation appointments:", error);
    } finally {
      setLoading(false);
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
                className="border-none shadow-lg rounded-xl bg-white hover:shadow-2xl transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-xl text-blue-800 truncate">
                          {consultation.consultation_title}
                        </h3>
                        <Badge className="ml-2 bg-blue-100 text-blue-700 border border-blue-200">
                          {consultation.original_examination
                            ?.examination_type || "-"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-500" />
                          <span className="truncate">
                            <span className="font-medium">Học sinh:</span>{" "}
                            {consultation.student?.full_name ||
                              "Không xác định"}{" "}
                            (MSSV: {consultation.student?.student_id || "-"})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>
                            <span className="font-medium">Ngày hẹn:</span>{" "}
                            {consultation.consultation_date
                              ? new Date(
                                  consultation.consultation_date
                                ).toLocaleDateString("vi-VN")
                              : "-"}{" "}
                            lúc {consultation.consultation_time || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-blue-500" />
                          <span>
                            <span className="font-medium">Bác sĩ:</span>{" "}
                            {consultation.consultation_doctor || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span>
                            <span className="font-medium">Loại khám:</span>{" "}
                            {consultation.original_examination
                              ?.examination_type || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
                      <span className="text-xs text-gray-400">
                        Tạo lúc:{" "}
                        {consultation.created_at
                          ? new Date(consultation.created_at).toLocaleString(
                              "vi-VN"
                            )
                          : "-"}
                      </span>
                      <span className="text-xs text-gray-400">
                        Cập nhật:{" "}
                        {consultation.updated_at
                          ? new Date(consultation.updated_at).toLocaleString(
                              "vi-VN"
                            )
                          : "-"}
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg mt-2 border-l-4 border-blue-400">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-800">
                        Ghi chú tư vấn:
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-line">
                      {consultation.consultation_notes || "Không có ghi chú."}
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

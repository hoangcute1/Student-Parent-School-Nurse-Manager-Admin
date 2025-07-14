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
                className="border-l-4 border-l-blue-500"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-blue-800 mb-1">
                        {consultation.consultation_title}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>
                            Học sinh:{" "}
                            {consultation.student?.full_name ||
                              "Không xác định"}{" "}
                            (MSSV: {consultation.student?.student_id || "-"})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            Ngày hẹn:{" "}
                            {consultation.consultation_date
                              ? new Date(
                                  consultation.consultation_date
                                ).toLocaleDateString("vi-VN")
                              : "-"}{" "}
                            lúc {consultation.consultation_time || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          <span>
                            Bác sĩ: {consultation.consultation_doctor || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>
                            Loại khám:{" "}
                            {consultation.original_examination
                              ?.examination_type || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
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

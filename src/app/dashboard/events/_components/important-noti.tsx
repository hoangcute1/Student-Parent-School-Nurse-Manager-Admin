"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Calendar,
  Clock,
  Syringe,
  User,
  MapPin,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useParentStudentsStore } from "@/stores/parent-students-store";
import { HealthExaminationPending } from "@/lib/api/health-examination";
import { fetchData } from "@/lib/api/api";

export default function ImportantNoti() {
  const [pendingExaminations, setPendingExaminations] = useState<any>([]);
  const [pendingVaccinations, setPendingVaccinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [processingVaccIds, setProcessingVaccIds] = useState<Set<string>>(
    new Set()
  );
  const {
    studentsData,
    fetchHealthExaminationsPending,
    fetchVaccinationSchedulesPending,
    approveHealthExamination,
    cancelHealthExamination,
  } = useParentStudentsStore();

  // Fetch all pending examinations for all students
  const fetchPendingExaminations = useCallback(async () => {
    if (!studentsData || studentsData.length === 0) {
      setPendingExaminations([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const allResults = await Promise.all(
        studentsData.map((student: any) =>
          fetchHealthExaminationsPending(student.student._id).then((res: any) =>
            (res || []).map((item: any) => ({
              ...item,
              student: student.student,
              // Đảm bảo luôn có trường date là ngày khám thực tế
              date: item.examination_date || item.date || "",
            }))
          )
        )
      );
      setPendingExaminations(allResults.flat());
    } catch (error) {
      setPendingExaminations([]);
    } finally {
      setIsLoading(false);
    }
  }, [studentsData, fetchHealthExaminationsPending]);

  // Fetch all pending vaccinations for all students
  const fetchPendingVaccinations = useCallback(async () => {
    if (!studentsData || studentsData.length === 0) {
      setPendingVaccinations([]);
      return;
    }
    try {
      const allResults = await Promise.all(
        studentsData.map((student: any) =>
          fetchVaccinationSchedulesPending(student.student._id).then(
            (res: any) =>
              (res || []).map((item: any) => ({
                ...item,
                student: student.student,
              }))
          )
        )
      );
      setPendingVaccinations(allResults.flat());
    } catch (error) {
      setPendingVaccinations([]);
    }
  }, [studentsData, fetchVaccinationSchedulesPending]);

  useEffect(() => {
    fetchPendingExaminations();
    fetchPendingVaccinations();
  }, [fetchPendingExaminations, fetchPendingVaccinations]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateDaysRemaining = (dateString: string) => {
    const examDate = new Date(dateString);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleApprove = async (studentId: string, examinationId: string) => {
    if (!studentsData || studentsData.length === 0) return;

    try {
      setProcessingIds((prev) => new Set([...prev, examinationId]));

      const result = await approveHealthExamination(studentId, examinationId);

      if (result.success) {
        // Fetch lại danh sách thông báo
        await fetchPendingExaminations();
      } else {
        console.error("Approve failed:", result.message);
      }
    } catch (error) {
      console.error("Error approving examination:", error);
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(examinationId);
        return newSet;
      });
    }
  };

  const handleReject = async (studentId: string, examinationId: string) => {
    if (!studentsData || studentsData.length === 0) return;

    try {
      setProcessingIds((prev) => new Set([...prev, examinationId]));

      const result = await cancelHealthExamination(studentId, examinationId);

      if (result.success) {
        // Fetch lại danh sách thông báo
        await fetchPendingExaminations();
      } else {
        console.error("Cancel failed:", result.message);
      }
    } catch (error) {
      console.error("Error cancelling examination:", error);
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(examinationId);
        return newSet;
      });
    }
  };

  // Approve vaccination
  const handleApproveVaccination = async (vaccinationId: string) => {
    try {
      setProcessingVaccIds((prev) => new Set([...prev, vaccinationId]));
      await fetchData(`/vaccination-schedules/${vaccinationId}/approve`, {
        method: "PUT",
      });
      await fetchPendingVaccinations();
    } catch (error) {
      // Optionally show error toast
    } finally {
      setProcessingVaccIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(vaccinationId);
        return newSet;
      });
    }
  };
  // Cancel vaccination
  const handleCancelVaccination = async (vaccinationId: string) => {
    try {
      setProcessingVaccIds((prev) => new Set([...prev, vaccinationId]));
      await fetchData(`/vaccination-schedules/${vaccinationId}/cancel`, {
        method: "PUT",
      });
      await fetchPendingVaccinations();
    } catch (error) {
      // Optionally show error toast
    } finally {
      setProcessingVaccIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(vaccinationId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="border-red-100">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-red-800">
            <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
            Thông báo quan trọng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Đang tải...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter for important notifications: only show events within 14 days
  const importantExaminations = pendingExaminations.filter((exam: any) => {
    const days = calculateDaysRemaining(exam.date);
    return days <= 14;
  });
  const importantVaccinations = pendingVaccinations.filter((vacc: any) => {
    const days = calculateDaysRemaining(vacc.vaccination_date);
    return days <= 14;
  });

  const hasNoImportant =
    importantExaminations.length === 0 && importantVaccinations.length === 0;

  return (
    <Card className="border-red-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-red-800">
          <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
          Thông báo quan trọng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {hasNoImportant ? (
            <div className="text-center py-8">
              <div className="rounded-full bg-green-100 p-3 mx-auto w-fit mb-3">
                <AlertCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-gray-600">Không có thông báo quan trọng nào</p>
            </div>
          ) : (
            <>
              {/* Pending Examinations */}
              {importantExaminations.map((examination: any) => {
                const daysRemaining = calculateDaysRemaining(examination.date);
                const isUrgent = daysRemaining <= 3;
                const isProcessing = processingIds.has(examination._id);
                return (
                  <div
                    key={"exam-" + examination._id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      isUrgent
                        ? "border-red-100 bg-red-50"
                        : "border-blue-100 bg-blue-50"
                    }`}
                  >
                    <div className="rounded-full p-2 bg-white border border-blue-200 mt-1">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                        {/* Cột trái */}
                        <div className="space-y-1">
                          <h4 className="font-medium text-blue-800 flex items-center gap-2">
                            {examination.title ||
                              examination.name ||
                              "Lịch khám sức khỏe"}
                          </h4>
                          <div className="flex items-center gap-2 text-blue-700 text-sm">
                            <User className="w-4 h-4" />
                            <span>
                              Học sinh: {examination.student?.name || "-"}
                              {examination.student?.class?.name &&
                                ` - Lớp ${examination.student.class.name}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-700 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Thời gian: {formatDate(examination.date)}
                              {examination.examination_time
                                ? ` lúc ${examination.examination_time}`
                                : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-700 text-sm">
                            <User className="w-4 h-4" />
                            <span>
                              Bác sĩ phụ trách: {examination.doctor_name || "-"}
                            </span>
                          </div>
                          {examination.description && (
                            <div className="flex items-center gap-2 text-blue-700 text-sm">
                              <span className="font-medium">Ghi chú:</span>{" "}
                              {examination.description}
                            </div>
                          )}
                        </div>
                        {/* Cột phải */}
                        <div className="space-y-1 md:text-right">
                          <div className="flex items-center gap-2 text-blue-700 text-sm md:justify-end">
                            <span className="font-medium">Loại khám:</span>{" "}
                            {examination.examination_type || "-"}
                          </div>
                          <div className="flex items-center gap-2 text-blue-700 text-sm md:justify-end">
                            <MapPin className="w-4 h-4" />
                            <span>Địa điểm: {examination.location || "-"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`$${
                            isUrgent
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {daysRemaining > 0
                            ? `Còn ${daysRemaining} ngày nữa`
                            : daysRemaining === 0
                            ? "Hôm nay"
                            : `Quá hạn ${Math.abs(daysRemaining)} ngày`}
                        </Badge>
                        {/* Badge chờ xác nhận khám */}
                        <Badge
                          variant="secondary"
                          className="text-xs text-blue-800 border-blue-200 bg-blue-50"
                        >
                          Chờ xác nhận khám
                        </Badge>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            handleApprove(
                              examination.student?._id,
                              examination._id
                            )
                          }
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <div className="flex items-center gap-1">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              <span>Đang xử lý...</span>
                            </div>
                          ) : (
                            "Đồng ý"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-100"
                          onClick={() =>
                            handleReject(
                              examination.student?._id,
                              examination._id
                            )
                          }
                          disabled={isProcessing}
                        >
                          Không đồng ý
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Pending Vaccinations */}
              {importantVaccinations.map((vacc: any) => {
                const daysRemaining = calculateDaysRemaining(
                  vacc.vaccination_date
                );
                const isUrgent = daysRemaining <= 3;
                const isProcessing = processingVaccIds.has(vacc._id);
                return (
                  <div
                    key={"vacc-" + vacc._id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      isUrgent
                        ? "border-red-100 bg-red-50"
                        : "border-blue-100 bg-blue-50"
                    }`}
                  >
                    <div
                      className={`rounded-full p-2 ${
                        isUrgent ? "bg-red-100" : "bg-blue-100"
                      }`}
                    >
                      <Syringe
                        className={`h-4 w-4 ${
                          isUrgent ? "text-red-600" : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {vacc.title || "Lịch tiêm chủng"}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-1">
                        <div className="flex items-center gap-2 text-blue-600">
                          <Syringe className="w-4 h-4" />
                          <span>Tên vắc-xin: {vacc.vaccine_type || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                          <User className="w-4 h-4" />
                          <span>
                            Học sinh: {vacc.student?.name || "-"}
                            {vacc.student?.class?.name &&
                              ` - Lớp ${vacc.student.class.name}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Thời gian tiêm:{" "}
                            {vacc.vaccination_date
                              ? formatDate(vacc.vaccination_date)
                              : "-"}{" "}
                            {vacc.vaccination_time
                              ? `lúc ${vacc.vaccination_time}`
                              : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                          <MapPin className="w-4 h-4" />
                          <span>Địa điểm: {vacc.location || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                          <User className="w-4 h-4" />
                          <span>
                            Bác sĩ phụ trách: {vacc.doctor_name || "-"}
                          </span>
                        </div>
                      </div>
                      {vacc.description && (
                        <div className="text-blue-700 text-sm mt-2">
                          <span className="font-medium">Ghi chú:</span>{" "}
                          {vacc.description}
                        </div>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`$${
                            isUrgent
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {daysRemaining > 0
                            ? `Còn ${daysRemaining} ngày nữa`
                            : daysRemaining === 0
                            ? "Hôm nay"
                            : `Quá hạn ${Math.abs(daysRemaining)} ngày`}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Chờ xác nhận tiêm chủng
                        </Badge>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveVaccination(vacc._id)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <div className="flex items-center gap-1">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              <span>Đang xử lý...</span>
                            </div>
                          ) : (
                            "Đồng ý"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-100"
                          onClick={() => handleCancelVaccination(vacc._id)}
                          disabled={isProcessing}
                        >
                          Không đồng ý
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

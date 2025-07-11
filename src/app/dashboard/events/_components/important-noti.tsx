"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar, Clock, Syringe } from "lucide-react";
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
    selectedStudent,
    fetchHealthExaminationsPending,
    fetchVaccinationSchedulesPending,
    approveHealthExamination,
    cancelHealthExamination,
  } = useParentStudentsStore();

  // Memoize fetch function để tránh re-create
  const fetchPendingExaminations = useCallback(async () => {
    if (!selectedStudent?.student?._id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetchHealthExaminationsPending(
        selectedStudent.student._id
      );
      setPendingExaminations(response || []);
    } catch (error) {
      setPendingExaminations([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStudent?.student?._id, fetchHealthExaminationsPending]);

  // Fetch pending vaccinations
  const fetchPendingVaccinations = useCallback(async () => {
    if (!selectedStudent?.student?._id) return;
    try {
      const response = await fetchVaccinationSchedulesPending(
        selectedStudent.student._id
      );
      setPendingVaccinations(response || []);
    } catch (error) {
      setPendingVaccinations([]);
    }
  }, [selectedStudent?.student?._id, fetchVaccinationSchedulesPending]);

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

  const handleApprove = async (examinationId: string) => {
    if (!selectedStudent?.student?._id) return;

    try {
      setProcessingIds((prev) => new Set([...prev, examinationId]));

      const result = await approveHealthExamination(
        selectedStudent.student._id,
        examinationId
      );

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

  const handleReject = async (examinationId: string) => {
    if (!selectedStudent?.student?._id) return;

    try {
      setProcessingIds((prev) => new Set([...prev, examinationId]));

      const result = await cancelHealthExamination(
        selectedStudent.student._id,
        examinationId
      );

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

  const hasNoImportant =
    pendingExaminations.length === 0 && pendingVaccinations.length === 0;

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
              {pendingExaminations.map((examination: any) => {
                const daysRemaining = calculateDaysRemaining(examination.date);
                const isUrgent = daysRemaining <= 3;
                const isProcessing = processingIds.has(examination._id);
                return (
                  <div
                    key={"exam-" + examination._id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      isUrgent
                        ? "border-red-100 bg-red-50"
                        : "border-amber-100 bg-amber-50"
                    }`}
                  >
                    <div
                      className={`rounded-full p-2 ${
                        isUrgent ? "bg-red-100" : "bg-amber-100"
                      }`}
                    >
                      <Calendar
                        className={`h-4 w-4 ${
                          isUrgent ? "text-red-600" : "text-amber-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{examination.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {examination.description ||
                          `Kiểm tra sức khỏe sẽ diễn ra vào ngày ${formatDate(
                            examination.date
                          )}.`}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`$${
                            isUrgent
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {daysRemaining > 0
                            ? `Còn ${daysRemaining} ngày nữa`
                            : daysRemaining === 0
                            ? "Hôm nay"
                            : `Quá hạn ${Math.abs(daysRemaining)} ngày`}
                        </Badge>
                        {examination.class && (
                          <Badge variant="secondary" className="text-xs">
                            Lớp {examination.class.name}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(examination._id)}
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
                          onClick={() => handleReject(examination._id)}
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
              {pendingVaccinations.map((vacc: any) => {
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
                      <p className="text-sm text-gray-600 mt-1">
                        {vacc.description ||
                          `Lịch tiêm chủng sẽ diễn ra vào ngày ${formatDate(
                            vacc.vaccination_date
                          )}.`}
                      </p>
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

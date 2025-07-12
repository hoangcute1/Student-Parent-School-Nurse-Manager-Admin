"use client";
import { useParentStudentsStore } from "@/stores/parent-students-store";
import ImportantNoti from "./_components/important-noti";
import NotiList from "./_components/noti-list";
import TreatmentHistoryComponent from "./_components/treatment-history";
import HealthExaminationNotifications from "./_components/health-examination-notifications";
import VaccinationNotifications from "./_components/vaccination-notifications";
import ConsultationAppointments from "./_components/consultation-appointments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useMemo, useState } from "react";
import { getAuthToken } from "@/lib/auth";

function calculateDaysRemaining(dateString: string) {
  if (!dateString) return 9999;
  const examDate = new Date(dateString);
  const today = new Date();
  const diffTime = examDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function EventsPage() {
  const {
    studentsData,
    isLoading,
    fetchStudentsByParent,
    fetchHealthExaminationsPending,
    fetchVaccinationSchedulesPending,
  } = useParentStudentsStore();

  const [pendingExaminations, setPendingExaminations] = useState<any[]>([]);
  const [pendingVaccinations, setPendingVaccinations] = useState<any[]>([]);

  useEffect(() => {
    fetchStudentsByParent();
  }, [fetchStudentsByParent]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!studentsData || studentsData.length === 0) {
        setPendingExaminations([]);
        setPendingVaccinations([]);
        return;
      }
      // Fetch pending examinations
      const allExams = await Promise.all(
        studentsData.map((student: any) =>
          fetchHealthExaminationsPending(student.student._id).then((res: any) =>
            (res || []).map((item: any) => ({
              ...item,
              student: student.student,
              date: item.examination_date || item.date || "",
            }))
          )
        )
      );
      setPendingExaminations(allExams.flat());

      // Fetch pending vaccinations
      const allVaccs = await Promise.all(
        studentsData.map((student: any) =>
          fetchVaccinationSchedulesPending(student.student._id).then(
            (res: any) =>
              (res || []).map((item: any) => ({
                ...item,
                student: student.student,
                date: item.vaccination_date || item.date || "",
              }))
          )
        )
      );
      setPendingVaccinations(allVaccs.flat());
    };
    fetchAll();
  }, [
    studentsData,
    fetchHealthExaminationsPending,
    fetchVaccinationSchedulesPending,
  ]);

  // Tách sự kiện > 14 ngày
  const upcomingExaminations = useMemo(
    () =>
      pendingExaminations.filter((exam: any) => {
        const days = calculateDaysRemaining(exam.date);
        return days > 14;
      }),
    [pendingExaminations]
  );
  const upcomingVaccinations = useMemo(
    () =>
      pendingVaccinations.filter((vacc: any) => {
        const days = calculateDaysRemaining(vacc.date);
        return days > 14;
      }),
    [pendingVaccinations]
  );

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Thông báo tổng hợp & Thông báo tiêm chủng
          </h1>
          <p className="text-blue-600">
            Theo dõi thông báo và thông tin tiêm chủng của con em bạn
          </p>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-2 bg-blue-50 rounded-lg p-1">
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2 rounded-md text-center font-medium transition-all"
          >
            Thông báo tổng hợp
          </TabsTrigger>
          <TabsTrigger
            value="health-examinations"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2 rounded-md text-center font-medium transition-all"
          >
            Lịch khám sức khỏe
          </TabsTrigger>
          <TabsTrigger
            value="vaccinations"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2 rounded-md text-center font-medium transition-all"
          >
            Lịch tiêm chủng
          </TabsTrigger>
          <TabsTrigger
            value="consultations"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2 rounded-md text-center font-medium transition-all"
          >
            Lịch hẹn tư vấn
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <ImportantNoti />
          <NotiList
            upcomingExaminations={upcomingExaminations}
            upcomingVaccinations={upcomingVaccinations}
          />
        </TabsContent>

        <TabsContent value="health-examinations" className="space-y-6">
          {/* Luôn hiển thị tất cả thông báo lịch khám sức khỏe cho phụ huynh */}
          <HealthExaminationNotifications />
        </TabsContent>

        <TabsContent value="vaccinations" className="space-y-6">
          <VaccinationNotifications />
        </TabsContent>

        <TabsContent value="consultations" className="space-y-6">
          <ConsultationAppointments />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <TreatmentHistoryComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

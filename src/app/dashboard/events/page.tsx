"use client";
import { useParentStudentsStore } from "@/stores/parent-students-store";
import ImportantNoti from "./_components/important-noti";
import NotiList from "./_components/noti-list";
import TreatmentHistoryComponent from "./_components/treatment-history";
import HealthExaminationNotifications from "./_components/health-examination-notifications";
import VaccinationNotifications from "./_components/vaccination-notifications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { getAuthToken } from "@/lib/auth";

export default function EventsPage() {
  const { studentsData, isLoading, fetchStudentsByParent, updateStudent } =
    useParentStudentsStore();

  useEffect(() => {
    fetchStudentsByParent();
  }, [fetchStudentsByParent]);

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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Thông báo tổng hợp
          </TabsTrigger>
          <TabsTrigger
            value="health-examinations"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Lịch khám sức khỏe
          </TabsTrigger>
          <TabsTrigger
            value="vaccinations"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Thông báo tiêm chủng
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Lịch sử sự cố y tế
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <ImportantNoti />
          <NotiList />
        </TabsContent>

        <TabsContent value="health-examinations" className="space-y-6">
          <HealthExaminationNotifications />
        </TabsContent>

        <TabsContent value="vaccinations" className="space-y-6">
          <VaccinationNotifications />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <TreatmentHistoryComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

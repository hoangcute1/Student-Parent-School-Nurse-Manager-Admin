"use client";
import { useParentStudentsStore } from "@/stores/parent-students-store";
import ImportantNoti from "./_components/important-noti";
import NotiList from "./_components/noti-list";
import TreatmentHistoryComponent from "./_components/treatment-history";
import HealthExaminationNotifications from "./_components/health-examination-notifications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";

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
            Sự cố y tế & Lịch sử bệnh án
          </h1>
          <p className="text-blue-600">
            Theo dõi thông báo và lịch sử bệnh án của con em bạn
          </p>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Thông báo sự cố
          </TabsTrigger>
          <TabsTrigger
            value="health-examinations"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Lịch khám sức khỏe
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Lịch sử bệnh án
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <ImportantNoti />
          <NotiList />
        </TabsContent>

        <TabsContent value="health-examinations" className="space-y-6">
          <HealthExaminationNotifications parentId="current-parent-id" />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <TreatmentHistoryComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

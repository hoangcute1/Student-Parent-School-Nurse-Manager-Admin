"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HealthExaminationEventList from "./_components/health-examination-event-list";
import AllHealthExaminationEventList from "./_components/all-health-examination-event-list";
import HealthResultStats from "./_components/health-result-stats";
import {
  Calendar,
  CheckCircle,
  Clock,
  Stethoscope,
  BarChart3,
} from "lucide-react";

export default function HealthResultPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl shadow-lg mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent">
            Thống kê lịch khám sức khỏe
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Xem thống kê và theo dõi tiến độ các lịch khám sức khỏe theo khối
            lớp và từng học sinh
          </p>
        </div>

        {/* HealthResultStats ở đầu trang */}
        <HealthResultStats key={`stats-${refreshKey}`} />

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              Danh sách sự kiện
            </TabsTrigger>
            <TabsTrigger
              value="all-examinations"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Thống kê tất cả lịch khám
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <HealthExaminationEventList key={`events-${refreshKey}`} />
          </TabsContent>

          <TabsContent value="all-examinations" className="space-y-6">
            <AllHealthExaminationEventList key={`all-${refreshKey}`} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

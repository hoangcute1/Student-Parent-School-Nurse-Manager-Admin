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
import { Calendar, CheckCircle, Clock, Stethoscope, BarChart3 } from "lucide-react";

export default function HealthResultPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Thống kê lịch khám sức khỏe
          </h1>
          <p className="text-blue-600">
            Xem thống kê và theo dõi tiến độ các lịch khám sức khỏe theo khối lớp và từng học sinh
          </p>
        </div>
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
  );
}

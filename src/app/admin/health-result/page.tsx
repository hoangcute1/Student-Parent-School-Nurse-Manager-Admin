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
import CreateHealthExaminationForm from "./_components/create-health-examination-form-simple";
import HealthExaminationEventList from "./_components/health-examination-event-list";
import AllHealthExaminationEventList from "./_components/all-health-examination-event-list";
import { Calendar, CheckCircle, Clock, Stethoscope } from "lucide-react";

export default function HealthResultPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExaminationCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Quản lý lịch khám sức khỏe
          </h1>
          <p className="text-blue-600">
            Tạo và quản lý lịch khám sức khỏe theo khối lớp và từng học sinh
          </p>
        </div>
        <CreateHealthExaminationForm onSuccess={handleExaminationCreated} />
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="events"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Sự kiện khám (Khối lớp)
          </TabsTrigger>
          <TabsTrigger
            value="all-examinations"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Tất cả lịch khám
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <HealthExaminationEventList key={refreshKey} />
        </TabsContent>

        <TabsContent value="all-examinations" className="space-y-6">
          <AllHealthExaminationEventList key={refreshKey} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

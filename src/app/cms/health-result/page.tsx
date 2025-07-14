"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateHealthExaminationForm from "./_components/create-health-examination-form-simple";
import HealthExaminationEventList from "./_components/health-examination-event-list";
import AllHealthExaminationEventList from "./_components/all-health-examination-event-list";
import {
  Calendar,
  CheckCircle,
  Clock,
  Stethoscope,
  Users,
  AlertTriangle,
  Activity,
  TrendingUp,
} from "lucide-react";
import { fetchData } from "@/lib/api/api";

export default function HealthResultPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    students: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const events = await fetchData<any[]>("/health-examinations/events");

        // Ensure events is an array
        if (!Array.isArray(events)) {
          console.warn("Events is not an array:", events);
          return;
        }

        let total = events.length;
        let completed = 0;
        let pending = 0;
        let students = 0;

        events.forEach((event) => {
          completed += event.completed_count || 0;
          pending += event.pending_count || 0;
          students += event.total_students || 0;
        });

        setStats({
          total,
          completed,
          pending,
          students,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        // fallback giữ nguyên stats cũ
      }
    };
    fetchStats();
  }, [refreshKey]);

  const handleExaminationCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl shadow-lg mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-sky-800 bg-clip-text text-transparent">
            Quản lý khám sức khỏe
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tạo và quản lý lịch khám sức khỏe theo khối lớp và từng học sinh
          </p>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng sự kiện khám
                  </p>
                  <p className="text-3xl font-bold text-sky-700">
                    {stats.total}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    ↗ Trong tháng này
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-sky-100 to-sky-200 rounded-xl">
                  <Calendar className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Đã hoàn thành
                  </p>
                  <p className="text-3xl font-bold text-emerald-700">
                    {stats.completed}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">Tỷ lệ 75%</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                  <p className="text-3xl font-bold text-amber-700">
                    {stats.pending}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">Cần xử lý</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Học sinh tham gia
                  </p>
                  <p className="text-3xl font-bold text-purple-700">
                    {stats.students}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">+89 tháng này</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">
                  Thao tác nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CreateHealthExaminationForm
                  onSuccess={handleExaminationCreated}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <Tabs defaultValue="events" className="w-full">
                  <TabsList className="flex w-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                    <TabsTrigger
                      value="events"
                      className="flex-1 data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700 data-[state=active]:shadow-sm data-[state=active]:border-none data-[state=active]:z-10 transition-all duration-200 rounded-none"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Sự kiện khám (Khối lớp)
                    </TabsTrigger>
                    <TabsTrigger
                      value="all-examinations"
                      className="flex-1 data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700 data-[state=active]:shadow-sm data-[state=active]:border-none data-[state=active]:z-10 transition-all duration-200 rounded-none"
                    >
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Tất cả lịch khám
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="events" className="mt-6 space-y-6">
                    <HealthExaminationEventList key={refreshKey} />
                  </TabsContent>

                  <TabsContent
                    value="all-examinations"
                    className="mt-6 space-y-6"
                  >
                    <AllHealthExaminationEventList key={refreshKey} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

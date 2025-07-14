"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle, Clock, Syringe, Users } from "lucide-react";
import { CreateVaccinationSchedule } from "./_components/create-vaccination-schedule";
import { VaccinationList } from "./_components/vaccination-list";
import { VaccinationDetail } from "./_components/vaccination-detail";
import { fetchData } from "@/lib/api/api";
import { toast } from "sonner";
import { useVaccinationStore } from "@/stores/vaccination-store";

export default function VaccinationManagementPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventForClasses, setSelectedEventForClasses] = useState<
    string | null
  >(null);
  const { events, loading } = useVaccinationStore();

  // Thống kê
  const stats = {
    total: events.length,
    completed: events.reduce((sum, e) => sum + (e.completed_count || 0), 0),
    pending: events.reduce((sum, e) => sum + (e.pending_count || 0), 0),
    students: events.reduce((sum, e) => sum + (e.total_students || 0), 0),
  };

  const handleDeleteSchedule = async (event: any) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá sự kiện tiêm chủng này?"))
      return;
    try {
      if (Array.isArray(event.vaccinations) && event.vaccinations.length > 0) {
        for (const v of event.vaccinations) {
          await fetchData(`/vaccination-schedules/${v._id}`, {
            method: "DELETE",
          });
        }
      } else {
        // fallback: xoá theo event._id nếu không có vaccinations
        await fetchData(`/vaccination-schedules/${event._id}`, {
          method: "DELETE",
        });
      }
      toast.success("Đã xoá sự kiện tiêm chủng thành công!");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Xoá sự kiện thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl shadow-lg mb-4">
            <Syringe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-sky-800 bg-clip-text text-transparent">
            Quản lý lịch tiêm chủng
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tạo và quản lý lịch tiêm chủng theo khối lớp và từng học sinh
          </p>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng sự kiện tiêm
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
                  <p className="text-xs text-emerald-600 mt-1">
                    Tỷ lệ{" "}
                    {stats.total
                      ? Math.round(
                          (stats.completed / (stats.students || 1)) * 100
                        )
                      : 0}
                    %
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Chờ phản hồi
                  </p>
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
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Syringe className="w-4 h-4 mr-2" />
                  Tạo lịch tiêm chủng
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <Tabs defaultValue="my-schedules" className="w-full">
                  <TabsList className="flex w-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                    <TabsTrigger
                      value="my-schedules"
                      className="flex-1 data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700 data-[state=active]:shadow-sm data-[state=active]:border-none data-[state=active]:z-10 transition-all duration-200 rounded-none"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Lịch tiêm chủng sắp tới
                    </TabsTrigger>
                    <TabsTrigger
                      value="all-schedules"
                      className="flex-1 data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700 data-[state=active]:shadow-sm data-[state=active]:border-none data-[state=active]:z-10 transition-all duration-200 rounded-none"
                    >
                      <Syringe className="w-4 h-4 mr-2" />
                      Tất cả lịch tiêm
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="my-schedules" className="mt-6 space-y-6">
                    <VaccinationList
                      filter="all"
                      onViewDetail={setSelectedEventId}
                      onDelete={undefined} // Không có nút xoá trong tab "sắp tới"
                    />
                  </TabsContent>
                  <TabsContent value="all-schedules" className="mt-6 space-y-6">
                    <VaccinationList
                      filter="all"
                      onViewDetail={setSelectedEventId}
                      onDelete={handleDeleteSchedule} // Có nút xoá trong tab "tất cả"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal tạo lịch tiêm */}
        {showCreateForm && (
          <CreateVaccinationSchedule
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => setShowCreateForm(false)}
          />
        )}

        {/* Modal xem chi tiết sự kiện */}
        {selectedEventId && (
          <VaccinationDetail
            eventId={selectedEventId}
            onClose={() => setSelectedEventId(null)}
          />
        )}
      </div>
    </div>
  );
}

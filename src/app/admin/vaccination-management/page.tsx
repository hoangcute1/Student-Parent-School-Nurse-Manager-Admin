"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle, Clock, Syringe } from "lucide-react";
import { CreateVaccinationSchedule } from "./_components/create-vaccination-schedule";
import { VaccinationList } from "./_components/vaccination-list";
import { VaccinationDetail } from "./_components/vaccination-detail";
import { fetchData } from "@/lib/api/api";
import { toast } from "sonner";

export default function VaccinationManagementPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);

  // Load schedules from localStorage on component mount
  useEffect(() => {
    const savedSchedules = localStorage.getItem("vaccination-schedules");
    if (savedSchedules) {
      try {
        setSchedules(JSON.parse(savedSchedules));
      } catch (error) {
        console.error("Error loading schedules from localStorage:", error);
      }
    }
  }, []);

  // Save schedules to localStorage whenever schedules change
  useEffect(() => {
    localStorage.setItem("vaccination-schedules", JSON.stringify(schedules));
  }, [schedules]);

  const handleCreateSchedule = () => {
    setShowCreateForm(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  const handleCreateClose = () => {
    setShowCreateForm(false);
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl shadow-lg mb-4">
            <Syringe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent">
            Quản lý lịch tiêm chủng
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tạo và quản lý lịch tiêm chủng theo khối lớp và từng học sinh
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my-schedules" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="my-schedules"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Syringe className="w-4 h-4 mr-2" />
              Lịch tiêm chủng sắp tới
            </TabsTrigger>
            <TabsTrigger
              value="all-schedules"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Tất cả lịch tiêm
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-schedules" className="space-y-6">
            <VaccinationList
              filter="today"
              onViewDetail={setSelectedEventId}
              onDelete={handleDeleteSchedule}
            />
          </TabsContent>

          <TabsContent value="all-schedules" className="space-y-6">
            <VaccinationList
              filter="all"
              onViewDetail={setSelectedEventId}
              onDelete={handleDeleteSchedule}
            />
          </TabsContent>
        </Tabs>

        {/* Modal tạo lịch tiêm */}
        {/* {showCreateForm && (
          <CreateVaccinationSchedule
            onClose={handleCreateClose}
            onSuccess={handleCreateSuccess}
          />
        )} */}

        {/* Modal xem chi tiết */}
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

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
  const [selectedEventForClasses, setSelectedEventForClasses] = useState<
    string | null
  >(null); // Thêm state cho việc xem danh sách lớp
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Quản lý lịch tiêm chủng
          </h1>
          <p className="text-blue-600">
            Tạo và quản lý lịch tiêm chủng theo khối lớp và từng học sinh
          </p>
        </div>
        <Button
          onClick={handleCreateSchedule}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Syringe className="w-4 h-4 mr-2" />
          Tạo lịch tiêm chủng
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-schedules" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="my-schedules"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Lịch tiêm chủng sắp tới
          </TabsTrigger>
          <TabsTrigger
            value="all-schedules"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Tất cả lịch tiêm
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-schedules" className="space-y-4">
          {" "}
          <VaccinationList
            filter="all" // hiện tất cả lịch tiêm chủng hiện tại và tương lai
            onViewDetail={setSelectedEventId}
            onViewClasses={setSelectedEventForClasses} // Thêm prop mới
            onDelete={handleDeleteSchedule}
          />
        </TabsContent>

        <TabsContent value="all-schedules" className="space-y-4">
          {" "}
          <VaccinationList
            filter="all" // hiện tất cả lịch tiêm
            onViewDetail={setSelectedEventId}
            onViewClasses={setSelectedEventForClasses} // Thêm prop mới
            onDelete={handleDeleteSchedule}
          />
        </TabsContent>
      </Tabs>

      {/* Modal tạo lịch tiêm */}
      {showCreateForm && (
        <CreateVaccinationSchedule
          onClose={handleCreateClose}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Modal xem chi tiết sự kiện */}
      {selectedEventId && (
        <VaccinationDetail
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}

      {/* Modal xem danh sách lớp */}
      {selectedEventForClasses && (
        <VaccinationDetail
          eventId={selectedEventForClasses}
          onClose={() => setSelectedEventForClasses(null)}
        />
      )}
    </div>
  );
}

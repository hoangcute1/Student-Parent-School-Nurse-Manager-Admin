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
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null
  );
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="my-schedules"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Lịch tiêm của tôi
          </TabsTrigger>
          <TabsTrigger
            value="all-schedules"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Tất cả lịch tiêm
          </TabsTrigger>
          <TabsTrigger
            value="workflow"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Hướng dẫn
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-schedules" className="space-y-4">
          {" "}
          <VaccinationList
            filter="my"
            refreshKey={refreshKey}
            onViewDetail={setSelectedScheduleId}
            onDelete={handleDeleteSchedule}
            schedules={schedules}
          />
        </TabsContent>

        <TabsContent value="all-schedules" className="space-y-4">
          {" "}
          <VaccinationList
            filter="all"
            refreshKey={refreshKey}
            onViewDetail={setSelectedScheduleId}
            onDelete={handleDeleteSchedule}
            schedules={schedules}
          />
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-800">
                Luồng chức năng tiêm chủng
              </CardTitle>
              <p className="text-blue-600 text-sm">
                Quy trình hoàn chỉnh từ tạo lịch đến trả kết quả
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bước 1 */}
              <div className="relative pl-8 pb-6 border-l-2 border-blue-200">
                <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-blue-800 text-lg">
                    Bước 1: Tạo lịch tiêm
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Nhân viên y tế tạo lịch tiêm chủng cho khối lớp hoặc từng
                    học sinh cụ thể.
                  </p>
                  <div className="bg-blue-50 p-3 rounded-lg mt-2">
                    <p className="text-blue-800 text-sm font-medium">
                      💡 Thao tác: Chọn loại vaccine, khối lớp, ngày tiêm và địa
                      điểm
                    </p>
                  </div>
                </div>
              </div>

              {/* Bước 2 */}
              <div className="relative pl-8 pb-6 border-l-2 border-green-200">
                <div className="absolute -left-3 top-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-green-800 text-lg">
                    Bước 2: Thông báo phụ huynh
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Hệ thống tự động gửi thông báo đến phụ huynh qua
                    dashboard/events.
                  </p>
                  <div className="bg-green-50 p-3 rounded-lg mt-2">
                    <p className="text-green-800 text-sm font-medium">
                      📧 Kênh thông báo: Dashboard, email, SMS (nếu có)
                    </p>
                  </div>
                </div>
              </div>

              {/* Bước 3 */}
              <div className="relative pl-8 pb-6 border-l-2 border-yellow-200">
                <div className="absolute -left-3 top-0 w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-yellow-800 text-lg">
                    Bước 3: Phụ huynh phản hồi
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Phụ huynh xem thông báo về chương trình tiêm chủng và chọn
                    cho con em tham gia.
                  </p>
                  <div className="bg-yellow-50 p-3 rounded-lg mt-2">
                    <div className="flex justify-between items-center">
                      <p className="text-yellow-800 text-sm font-medium">
                        ✅ Đồng ý tham gia
                      </p>
                      <p className="text-yellow-800 text-sm font-medium">
                        ❌ Từ chối tham gia
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bước 4 */}
              <div className="relative pl-8 pb-6 border-l-2 border-purple-200">
                <div className="absolute -left-3 top-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-purple-800 text-lg">
                    Bước 4: Thực hiện tiêm chủng
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Nhân viên y tế tiến hành tiêm chủng và cập nhật kết quả.
                  </p>
                  <div className="bg-purple-50 p-3 rounded-lg mt-2">
                    <p className="text-purple-800 text-sm font-medium">
                      🏥 Ghi nhận: Trạng thái tiêm, phản ứng phụ, ghi chú y tế
                    </p>
                  </div>
                </div>
              </div>

              {/* Bước 5 */}
              <div className="relative pl-8">
                <div className="absolute -left-3 top-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">5</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-indigo-800 text-lg">
                    Bước 5: Báo cáo & Thống kê
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Tạo báo cáo tổng hợp kết quả tiêm chủng và thống kê hiệu quả
                    chương trình.
                  </p>
                  <div className="bg-indigo-50 p-3 rounded-lg mt-2">
                    <p className="text-indigo-800 text-sm font-medium">
                      📊 Bao gồm: Thống kê tỷ lệ tiêm, báo cáo chi tiết, xuất dữ
                      liệu
                    </p>
                  </div>
                </div>
              </div>

              {/* Lưu ý quan trọng */}
              <div className="mt-8 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 rounded-lg">
                <h4 className="font-bold text-red-800 mb-2">
                  ⚠️ Lưu ý quan trọng
                </h4>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>
                    • Phụ huynh cần phản hồi trước thời hạn để đảm bảo đủ
                    vaccine
                  </li>
                  <li>
                    • Cần kiểm tra tình trạng sức khỏe học sinh trước khi tiêm
                  </li>
                  <li>• Theo dõi phản ứng phụ sau tiêm trong 30 phút</li>
                  <li>• Cập nhật sổ tiêm chủng và hồ sơ y tế học sinh</li>
                </ul>
              </div>

              {/* Nút hành động */}
              <div className="flex gap-4 pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700 flex-1">
                  <Syringe className="w-4 h-4 mr-2" />
                  Tạo lịch tiêm mới
                </Button>
                <Button variant="outline" className="flex-1">
                  📋 Xem danh sách chờ phản hồi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal tạo lịch tiêm */}
      {showCreateForm && (
        <CreateVaccinationSchedule
          onClose={handleCreateClose}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Modal xem chi tiết */}
      {selectedScheduleId && (
        <VaccinationDetail
          scheduleId={selectedScheduleId}
          onClose={() => setSelectedScheduleId(null)}
        />
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Edit, HeartPulse, Syringe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Child, HealthRecord } from "@/lib/models";
import { getChildById, getHealthRecordByChildId } from "@/lib/api";
import Link from "next/link";

interface ChildDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ChildDetailsPage({ params }: ChildDetailsPageProps) {
  const router = useRouter();
  const [child, setChild] = useState<Child | null>(null);
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        setLoading(true);
        // Fetch child data
        const childData = await getChildById(params.id);
        setChild(childData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching child data:", error);
        setError("Không thể tải thông tin học sinh. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    if (params.id) {
      fetchChildData();
    }
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center p-8">Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  if (!child) {
    return <div className="p-8">Không tìm thấy thông tin học sinh.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{child.name}</h1>
        </div>
        <Link href={`/dashboard/parent/children/${child.id}/edit`}>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>Thông tin cá nhân của học sinh</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Họ và tên:</span>
                <span className="text-sm">{child.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Ngày sinh:</span>
                <span className="text-sm">
                  {new Date(child.dob).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Giới tính:</span>
                <span className="text-sm">
                  {child.gender === "male" ? "Nam" : "Nữ"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Khối lớp:</span>
                <span className="text-sm">{child.grade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Lớp:</span>
                <span className="text-sm">{child.class}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="health-info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="health-info" className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4" />
            <span className="hidden sm:inline">Thông tin sức khỏe</span>
            <span className="sm:hidden">Sức khỏe</span>
          </TabsTrigger>
          <TabsTrigger value="vaccinations" className="flex items-center gap-2">
            <Syringe className="h-4 w-4" />
            <span className="hidden sm:inline">Tiêm chủng</span>
            <span className="sm:hidden">Tiêm chủng</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Lịch kiểm tra</span>
            <span className="sm:hidden">Lịch</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health-info">
          {healthRecord ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Chiều cao:</span>
                        <span className="text-sm">
                          {healthRecord.basicInfo.height} cm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Cân nặng:</span>
                        <span className="text-sm">
                          {healthRecord.basicInfo.weight} kg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Nhóm máu:</span>
                        <span className="text-sm">
                          {healthRecord.basicInfo.bloodType ||
                            "Chưa có thông tin"}
                          {healthRecord.basicInfo.rhFactor
                            ? ` (${
                                healthRecord.basicInfo.rhFactor === "positive"
                                  ? "Rh+"
                                  : "Rh-"
                              })`
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Thị lực:</span>
                        <span className="text-sm">
                          {healthRecord.basicInfo.vision === "normal"
                            ? "Bình thường"
                            : healthRecord.basicInfo.vision === "myopia"
                            ? "Cận thị"
                            : healthRecord.basicInfo.vision === "hyperopia"
                            ? "Viễn thị"
                            : healthRecord.basicInfo.vision === "astigmatism"
                            ? "Loạn thị"
                            : "Khác"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Thính lực:</span>
                        <span className="text-sm">
                          {healthRecord.basicInfo.hearing === "normal"
                            ? "Bình thường"
                            : healthRecord.basicInfo.hearing === "mild_loss"
                            ? "Suy giảm nhẹ"
                            : healthRecord.basicInfo.hearing === "moderate_loss"
                            ? "Suy giảm trung bình"
                            : healthRecord.basicInfo.hearing === "severe_loss"
                            ? "Suy giảm nặng"
                            : "Khác"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          Cập nhật lần cuối:
                        </span>
                        <span className="text-sm">
                          {new Date(
                            healthRecord.lastUpdated
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bệnh mãn tính</CardTitle>
                </CardHeader>
                <CardContent>
                  {healthRecord.medicalHistory.chronicDiseases &&
                  healthRecord.medicalHistory.chronicDiseases.length > 0 ? (
                    <div className="space-y-2">
                      <ul className="list-disc pl-5">
                        {healthRecord.medicalHistory.chronicDiseases.map(
                          (disease, index) => (
                            <li key={index} className="text-sm">
                              {disease}
                            </li>
                          )
                        )}
                      </ul>
                      {healthRecord.medicalHistory.chronicDetails && (
                        <div className="pt-2">
                          <span className="text-sm font-medium">Chi tiết:</span>
                          <p className="text-sm mt-1">
                            {healthRecord.medicalHistory.chronicDetails}
                          </p>
                        </div>
                      )}
                      {healthRecord.medicalHistory.medications && (
                        <div className="pt-2">
                          <span className="text-sm font-medium">
                            Thuốc đang sử dụng:
                          </span>
                          <p className="text-sm mt-1">
                            {healthRecord.medicalHistory.medications}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Không có bệnh mãn tính
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dị ứng</CardTitle>
                </CardHeader>
                <CardContent>
                  {(healthRecord.allergies.food &&
                    healthRecord.allergies.food.length > 0) ||
                  (healthRecord.allergies.medications &&
                    healthRecord.allergies.medications.length > 0) ||
                  (healthRecord.allergies.other &&
                    healthRecord.allergies.other.length > 0) ? (
                    <div className="space-y-3">
                      {healthRecord.allergies.food &&
                        healthRecord.allergies.food.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">
                              Dị ứng thực phẩm:
                            </span>
                            <ul className="list-disc pl-5 mt-1">
                              {healthRecord.allergies.food.map(
                                (food, index) => (
                                  <li key={index} className="text-sm">
                                    {food}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                      {healthRecord.allergies.medications &&
                        healthRecord.allergies.medications.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">
                              Dị ứng thuốc:
                            </span>
                            <ul className="list-disc pl-5 mt-1">
                              {healthRecord.allergies.medications.map(
                                (med, index) => (
                                  <li key={index} className="text-sm">
                                    {med}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                      {healthRecord.allergies.other &&
                        healthRecord.allergies.other.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">
                              Dị ứng khác:
                            </span>
                            <ul className="list-disc pl-5 mt-1">
                              {healthRecord.allergies.other.map(
                                (item, index) => (
                                  <li key={index} className="text-sm">
                                    {item}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                      {healthRecord.allergies.details && (
                        <div>
                          <span className="text-sm font-medium">
                            Chi tiết dị ứng:
                          </span>
                          <p className="text-sm mt-1">
                            {healthRecord.allergies.details}
                          </p>
                        </div>
                      )}

                      {healthRecord.allergies.emergencyMedication && (
                        <div>
                          <span className="text-sm font-medium text-red-500">
                            Thuốc khẩn cấp:
                          </span>
                          <p className="text-sm mt-1">
                            {healthRecord.allergies.emergencyMedication}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Không có dị ứng
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-10">
                <div className="text-center">
                  <HeartPulse className="mx-auto h-10 w-10 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium">
                    Chưa có hồ sơ sức khỏe
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Hiện tại chưa có thông tin sức khỏe cho học sinh này
                  </p>
                  <Button className="mt-4" variant="outline">
                    Yêu cầu tạo hồ sơ sức khỏe
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="vaccinations">
          {healthRecord &&
          healthRecord.vaccinations &&
          healthRecord.vaccinations.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử tiêm chủng</CardTitle>
                <CardDescription>
                  Các mũi tiêm đã thực hiện và dự kiến
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50 text-left">
                          <th className="px-4 py-3 font-medium">Vaccine</th>
                          <th className="px-4 py-3 font-medium">Ngày</th>
                          <th className="px-4 py-3 font-medium">Địa điểm</th>
                          <th className="px-4 py-3 font-medium">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {healthRecord.vaccinations.map((vaccination, index) => (
                          <tr
                            key={vaccination.id}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-4 py-3">{vaccination.vaccine}</td>
                            <td className="px-4 py-3">
                              {new Date(vaccination.date).toLocaleDateString(
                                "vi-VN"
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {vaccination.location}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  vaccination.administered
                                    ? "bg-green-100 text-green-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {vaccination.administered
                                  ? "Đã tiêm"
                                  : "Dự kiến"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-10">
                <div className="text-center">
                  <Syringe className="mx-auto h-10 w-10 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium">
                    Chưa có thông tin tiêm chủng
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Hiện tại chưa có thông tin tiêm chủng cho học sinh này
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Lịch kiểm tra sức khỏe</CardTitle>
              <CardDescription>
                Các sự kiện kiểm tra sức khỏe sắp tới
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock data for health check events */}
                {[
                  {
                    id: "1",
                    title: "Khám sức khỏe định kỳ",
                    date: "2025-06-10",
                    time: "08:00 - 11:30",
                    location: "Phòng y tế trường",
                    description:
                      "Khám sức khỏe định kỳ học kỳ 2 cho học sinh toàn trường",
                  },
                  {
                    id: "2",
                    title: "Tiêm vaccine cúm mùa",
                    date: "2025-06-15",
                    time: "09:00 - 12:00",
                    location: "Phòng y tế trường",
                    description:
                      "Chương trình tiêm vaccine cúm mùa cho học sinh",
                  },
                ].map((event) => (
                  <div key={event.id} className="rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-start md:items-end text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>
                            {new Date(event.date).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <span className="mt-1 text-gray-500">{event.time}</span>
                        <span className="mt-1 text-gray-500">
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

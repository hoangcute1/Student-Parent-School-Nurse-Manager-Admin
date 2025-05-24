"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Calendar, BookOpen, HeartPulse } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getParentChildren, getHealthRecordByChildId } from "@/lib/api";
import { Child as ChildType, HealthRecord } from "@/lib/models";
import { useAuth } from "@/lib/auth";

export default function ParentDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [children, setChildren] = useState<
    Array<{
      id: string;
      name: string;
      age: number;
      grade: string;
      healthStatus: string;
      nextVaccination?: string;
    }>
  >([]);

  useEffect(() => {
    const fetchChildrenData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Get children data
        const childrenData = await getParentChildren(user.id);

        // Process each child to get health info
        const processedChildren = await Promise.all(
          childrenData.map(async (child: ChildType) => {
            let healthStatus = "Không có thông tin";
            let nextVaccination = undefined;

            // Try to get health record if available
            if (child.healthRecordId) {
              try {
                const healthRecord = await getHealthRecordByChildId(child.id);

                // Determine health status based on health record
                healthStatus = determineHealthStatus(healthRecord);

                // Find next vaccination if any
                nextVaccination = findNextVaccination(healthRecord);
              } catch (error) {
                console.log(`No health record data for child ${child.id}`);
              }
            }

            return {
              id: child.id,
              name: child.name,
              age: calculateAge(child.dob),
              grade: child.class,
              healthStatus,
              nextVaccination,
            };
          })
        );

        setChildren(processedChildren);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching children data:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchChildrenData();
  }, [user]);

  // Determine health status based on health record
  const determineHealthStatus = (healthRecord: HealthRecord): string => {
    if (!healthRecord) return "Không có thông tin";

    // Check for chronic diseases
    if (
      healthRecord.medicalHistory.chronicDiseases &&
      healthRecord.medicalHistory.chronicDiseases.length > 0
    ) {
      return "Cần theo dõi";
    }

    // Check for severe allergies
    if (
      (healthRecord.allergies.food && healthRecord.allergies.food.length > 0) ||
      (healthRecord.allergies.medications &&
        healthRecord.allergies.medications.length > 0)
    ) {
      if (healthRecord.allergies.emergencyMedication) {
        return "Cần theo dõi";
      }
    }

    return "Tốt";
  };

  // Find next vaccination if any
  const findNextVaccination = (
    healthRecord: HealthRecord
  ): string | undefined => {
    if (!healthRecord || !healthRecord.vaccinations) return undefined;

    const today = new Date();
    const futureVaccinations = healthRecord.vaccinations
      .filter((v) => !v.administered && new Date(v.date) > today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (futureVaccinations.length > 0) {
      return new Date(futureVaccinations[0].date).toLocaleDateString("vi-VN");
    }

    return undefined;
  };

  // Calculate age from DOB
  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Quick access cards
  const quickAccess = [
    {
      title: "Hồ sơ sức khỏe",
      description: "Xem hồ sơ sức khỏe của con",
      icon: <HeartPulse className="h-5 w-5" />,
      href: "/dashboard/parent/children",
      color: "bg-pink-100 text-pink-700",
    },
    {
      title: "Lịch tiêm chủng",
      description: "Xem và cập nhật lịch tiêm chủng",
      icon: <Activity className="h-5 w-5" />,
      href: "/dashboard/parent/vaccinations",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Sự kiện y tế",
      description: "Xem các sự kiện y tế sắp tới",
      icon: <Calendar className="h-5 w-5" />,
      href: "/dashboard/parent/events",
      color: "bg-purple-100 text-purple-700",
    },
  ];

  // Upcoming events
  const upcomingEvents = [
    {
      id: "1",
      title: "Khám sức khỏe định kỳ",
      date: "10/06/2025",
      description: "Khám sức khỏe định kỳ cho học sinh Lớp 1-3",
    },
    {
      id: "2",
      title: "Tiêm vaccine phòng cúm",
      date: "15/06/2025",
      description: "Tiêm vaccine phòng cúm mùa cho học sinh toàn trường",
    },
    {
      id: "3",
      title: "Hội thảo dinh dưỡng học đường",
      date: "20/06/2025",
      description: "Hội thảo về dinh dưỡng học đường cho phụ huynh",
    },
  ];

  if (loading) {
    return <div className="p-8 text-center">Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Thông tin con của bạn</h2>
      {children.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {children.map((child) => (
            <Card key={child.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{child.name}</CardTitle>
                </div>
                <CardDescription>
                  {child.age} tuổi - Lớp {child.grade}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Tình trạng sức khỏe:
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        child.healthStatus === "Tốt"
                          ? "text-green-600"
                          : child.healthStatus === "Cần theo dõi"
                          ? "text-amber-600"
                          : "text-gray-600"
                      }`}
                    >
                      {child.healthStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Tiêm chủng tiếp theo:
                    </span>
                    <span className="text-sm font-medium">
                      {child.nextVaccination || "Không có"}
                    </span>
                  </div>
                  <div className="mt-4">
                    <Link href={`/dashboard/parent/children/${child.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">
              Chưa có thông tin học sinh
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Bạn chưa thêm thông tin học sinh nào vào hệ thống
            </p>
            <Link href="/dashboard/parent/children/add">
              <Button className="mt-4">Thêm học sinh</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <h2 className="text-xl font-semibold">Truy cập nhanh</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {quickAccess.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <div className={`p-2 ${item.color}`}>{item.icon}</div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={item.href}>
                <Button className="w-full">Truy cập</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-semibold">Sự kiện sắp tới</h2>
      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <Card key={event.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {event.date}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

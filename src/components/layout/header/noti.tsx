"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useParentStudentsStore } from "@/stores/parent-students-store";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export default function Notification() {
  const { studentsData, fetchStudentsByParent, fetchHealthExaminationsPending, fetchVaccinationSchedulesPending } = useParentStudentsStore();
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const prevCountRef = useRef(0);

  // Fetch students data when component mounts
  useEffect(() => {
    fetchStudentsByParent();
  }, [fetchStudentsByParent]);

  useEffect(() => {
    const fetchPendingNotifications = async () => {
      if (!studentsData || studentsData.length === 0) {
        setPendingCount(0);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Lấy tất cả lịch khám pending
        const healthExams = await Promise.all(
          studentsData.map((student: any) =>
            fetchHealthExaminationsPending(student.student._id).then((res: any) => res || [])
          )
        );

        // Lấy tất cả lịch tiêm chủng pending
        const vaccinations = await Promise.all(
          studentsData.map((student: any) =>
            fetchVaccinationSchedulesPending(student.student._id).then((res: any) => res || [])
          )
        );

        // Tính tổng số thông báo pending
        const totalHealthExams = healthExams.flat().length;
        const totalVaccinations = vaccinations.flat().length;
        const total = totalHealthExams + totalVaccinations;

        setPendingCount(total);
      } catch (error) {
        console.error("Error fetching pending notifications:", error);
        setPendingCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingNotifications();
  }, [studentsData, fetchHealthExaminationsPending, fetchVaccinationSchedulesPending]);

  // Hiển thị thông báo khi có thông báo mới
  useEffect(() => {
    if (!isLoading && pendingCount > 0 && pendingCount > prevCountRef.current) {
      const newNotifications = pendingCount - prevCountRef.current;
      if (newNotifications > 0) {
        toast.info(
          `Bạn có ${newNotifications} thông báo mới chưa đọc!`,
          {
            description: "Nhấn vào chuông để xem chi tiết",
            action: {
              label: "Xem ngay",
              onClick: () => router.push("/dashboard/events"),
            },
            duration: 5000,
          }
        );
      }
    }
    prevCountRef.current = pendingCount;
  }, [pendingCount, isLoading, router]);

  const handleClick = () => {
    router.push("/dashboard/events");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative"
            onClick={handleClick}
          >
            <Bell />
            {!isLoading && pendingCount > 0 && (
              <Badge className="absolute -top-1 -right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white p-0 flex items-center justify-center">
                {pendingCount}
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {pendingCount > 0 
              ? `Bạn có ${pendingCount} thông báo chưa đọc`
              : "Không có thông báo mới"
            }
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

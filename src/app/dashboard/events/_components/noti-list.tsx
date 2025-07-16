import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Syringe, User, MapPin } from "lucide-react";

type EventType =
  | {
      type: "examination";
      title: string;
      student: string;
      className?: string;
      examinationType?: string;
      date: string;
      time?: string;
      location?: string;
      doctor?: string;
      description?: string;
      note?: string;
    }
  | {
      type: "vaccination";
      title: string;
      student: string;
      className?: string;
      vaccineType?: string;
      date: string;
      time?: string;
      location?: string;
      doctor?: string;
      description?: string;
      note?: string;
    }
  | {
      type: "consultation";
      title: string;
      student: string;
      className?: string;
      date: string;
      time?: string;
      doctor?: string;
      description?: string;
      note?: string;
    };

interface NotiListProps {
  upcomingExaminations?: any[];
  upcomingVaccinations?: any[];
  upcomingConsultations?: any[];
}

export default function NotiList({
  upcomingExaminations = [],
  upcomingVaccinations = [],
  upcomingConsultations = [],
}: NotiListProps) {
  // Gộp và chuẩn hóa dữ liệu sự kiện
  const events: EventType[] = [
    ...upcomingExaminations.map((exam) => ({
      type: "examination" as const,
      title: exam.title || exam.name || "Lịch khám sức khỏe",
      student: exam.student?.name || "-",
      className: exam.student?.class?.name || exam.class?.name || "",
      examinationType: exam.examination_type || "-",
      date: exam.examination_date || exam.date || "",
      time: exam.examination_time || exam.time || "",
      location: exam.location || "-",
      doctor: exam.doctor_name || "-",
      description: exam.description || "Khám sức khỏe",
      note: exam.notes || "",
    })),
    ...upcomingVaccinations.map((vacc) => ({
      type: "vaccination" as const,
      title: vacc.title || "Lịch tiêm chủng",
      student: vacc.student?.name || "-",
      className: vacc.student?.class?.name || vacc.class?.name || "",
      vaccineType: vacc.vaccine_type || vacc.vaccineType || "-",
      date: vacc.vaccination_date || vacc.date || "",
      time: vacc.vaccination_time || vacc.time || "",
      location: vacc.location || "-",
      doctor: vacc.doctor_name || "-",
      description: vacc.description || "Tiêm chủng cho học sinh",
      note: vacc.notes || "",
    })),
    ...upcomingConsultations.map((consult) => ({
      type: "consultation" as const,
      title: consult.consultation_title || "Lịch hẹn tư vấn",
      student: consult.student?.full_name || consult.student?.name || "-",
      className: consult.student?.class?.name || consult.class?.name || "",
      date: consult.consultation_date || consult.date || "",
      time: consult.consultation_time || consult.time || "",
      doctor: consult.consultation_doctor || consult.doctor_name || "-",
      description:
        consult.consultation_notes || consult.description || "Tư vấn sức khỏe",
      note: consult.consultation_notes || consult.notes || "",
    })),
  ];

  function calculateDaysRemaining(dateString: string) {
    if (!dateString) return 9999;
    const examDate = new Date(dateString);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  function formatDateOnly(dateString: string) {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-blue-800">Sự kiện sắp tới</h2>
      </div>
      {events.length === 0 ? (
        <div className="text-center text-blue-600 py-6">
          Hiện chưa có sự kiện sắp tới
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, index) => {
            const daysRemaining = calculateDaysRemaining(event.date);
            const isVacc = event.type === "vaccination";
            const isExam = event.type === "examination";
            const isConsult = event.type === "consultation";
            return (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  isVacc
                    ? "border-blue-100 bg-blue-50"
                    : isExam
                    ? "border-amber-100 bg-amber-50"
                    : "border-green-100 bg-green-50"
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    isVacc
                      ? "bg-blue-100"
                      : isExam
                      ? "bg-amber-100"
                      : "bg-green-100"
                  }`}
                >
                  {isVacc ? (
                    <Syringe className="h-4 w-4 text-blue-600" />
                  ) : isExam ? (
                    <Calendar className="h-4 w-4 text-amber-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-800">{event.title}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-1">
                    <div className="flex items-center gap-2 text-blue-600">
                      <User className="w-4 h-4" />
                      <span>
                        Học sinh: {event.student}
                        {event.className && ` - Lớp ${event.className}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600">
                      <span>
                        {isExam
                          ? `Loại khám: ${event.examinationType || "-"}`
                          : isVacc
                          ? `Loại vắc-xin: ${event.vaccineType || "-"}`
                          : `Bác sĩ: ${event.doctor || "-"}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Ngày: {formatDateOnly(event.date)}
                        {event.time ? ` lúc ${event.time}` : ""}
                      </span>
                    </div>
                    {isExam || isVacc ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <MapPin className="w-4 h-4" />
                        <span>Địa điểm: {event.location || "-"}</span>
                      </div>
                    ) : null}
                    {isConsult ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <span>Bác sĩ phụ trách: {event.doctor || "-"}</span>
                      </div>
                    ) : null}
                  </div>
                  {event.description && (
                    <div className="text-blue-700 text-sm mt-2">
                      <span className="font-medium">Ghi chú:</span>{" "}
                      {event.description}
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`$${
                        isVacc
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : isExam
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }`}
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      {daysRemaining > 0
                        ? `Còn ${daysRemaining} ngày nữa`
                        : daysRemaining === 0
                        ? "Hôm nay"
                        : `Quá hạn ${Math.abs(daysRemaining)} ngày`}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Link href="/dashboard/events" className="block">
        <Button
          variant="outline"
          className="w-full group border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          Xem tất cả sự kiện
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </>
  );
}

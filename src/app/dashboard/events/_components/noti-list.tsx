import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Syringe, User, MapPin } from "lucide-react";

export default function NotiList({
  upcomingExaminations = [],
  upcomingVaccinations = [],
}: {
  upcomingExaminations?: any[];
  upcomingVaccinations?: any[];
}) {
  // Gộp và chuẩn hóa dữ liệu sự kiện
  const events = [
    ...upcomingExaminations.map((exam) => ({
      type: "examination",
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
      type: "vaccination",
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
            return (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  isVacc
                    ? "border-blue-100 bg-blue-50"
                    : "border-amber-100 bg-amber-50"
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    isVacc ? "bg-blue-100" : "bg-amber-100"
                  }`}
                >
                  {isVacc ? (
                    <Syringe className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Calendar className="h-4 w-4 text-amber-600" />
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
                        {event.type === "examination"
                          ? `Loại khám: ${event.examinationType || "-"}`
                          : `Loại vắc-xin: ${event.vaccineType || "-"}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Ngày: {formatDateOnly(event.date)}
                        {event.time ? ` lúc ${event.time}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600">
                      <MapPin className="w-4 h-4" />
                      <span>Địa điểm: {event.location || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600">
                      <span>Bác sĩ phụ trách: {event.doctor || "-"}</span>
                    </div>
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
                          : "bg-amber-50 text-amber-700 border-amber-200"
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

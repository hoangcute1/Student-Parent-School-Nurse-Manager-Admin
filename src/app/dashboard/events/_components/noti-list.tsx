import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";

export default function NotiList() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-blue-800">
          Sự cố y tế sắp tới
        </h2>
      </div>

      <div className="space-y-3">
        {[
          {
            title: "Kiểm tra sức khỏe định kỳ - Học kỳ 1",
            date: "20/05/2025",
            time: "08:00 - 11:30",
            description:
              "Kiểm tra sức khỏe tổng quát cho học sinh khối 1, 5, 9",
            location: "Phòng y tế trường học",
          },
          {
            title: "Tiêm chủng vắc-xin phòng cúm",
            date: "25/05/2025",
            time: "09:00 - 11:00",
            description:
              "Tiêm chủng cho học sinh đã đăng ký và được phụ huynh đồng ý",
            location: "Phòng y tế trường học",
          },
          {
            title: "Tư vấn dinh dưỡng học đường",
            date: "01/06/2025",
            time: "14:00 - 16:00",
            description:
              "Chương trình tư vấn dinh dưỡng cho phụ huynh và học sinh",
            location: "Hội trường trường học",
          },
        ].map((event, index) => (
          <div
            key={index}
            className="flex items-start gap-4 rounded-lg border border-blue-100 p-4 hover:border-blue-300 transition-all duration-200 cursor-pointer"
          >
            <div className="grid place-items-center rounded-lg bg-blue-100 p-3">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="grid gap-1">
              <h3 className="font-semibold text-blue-800">{event.title}</h3>
              <div className="flex items-center text-sm text-blue-600">
                <Calendar className="mr-1 h-3 w-3" />
                <time>{event.date}</time>
                <span className="mx-1">•</span>
                <Clock className="mr-1 h-3 w-3" />
                <time>{event.time}</time>
              </div>
              <p className="text-sm text-blue-600">{event.description}</p>
              <p className="text-xs text-blue-500 mt-1">
                Địa điểm: {event.location}
              </p>
            </div>
          </div>
        ))}
      </div>

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

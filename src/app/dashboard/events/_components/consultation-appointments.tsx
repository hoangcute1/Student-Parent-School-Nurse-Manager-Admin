import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ConsultationAppointments() {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          Lịch hẹn tư vấn
        </h2>
        <p className="text-gray-500">
          Chức năng này sẽ hiển thị các lịch hẹn tư vấn của bạn với nhà trường
          hoặc bác sĩ.
        </p>
      </CardContent>
    </Card>
  );
}

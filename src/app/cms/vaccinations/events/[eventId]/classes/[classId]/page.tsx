"use client";

import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import VaccinationClassDetail from "../../../../_components/vaccination-class-detail";

export default function VaccinationClassDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const classId = params.classId as string;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/cms/vaccinations/events/${eventId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại sự kiện
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Chi tiết lớp học - Tiêm chủng
          </h1>
          <p className="text-blue-600">
            Quản lý và cập nhật kết quả tiêm chủng cho từng học sinh
          </p>
        </div>
      </div>

      <VaccinationClassDetail eventId={eventId} classId={classId} />
    </div>
  );
}

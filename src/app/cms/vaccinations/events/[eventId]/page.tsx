"use client";

import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import VaccinationEventDetail from "@/app/cms/vaccinations/_components/vaccination-event-detail";

export default function VaccinationEventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/cms/vaccinations">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Chi tiết sự kiện tiêm chủng
          </h1>
          <p className="text-blue-600">
            Xem chi tiết và quản lý lịch tiêm chủng theo lớp
          </p>
        </div>
      </div>

      <VaccinationEventDetail eventId={eventId} />
    </div>
  );
}

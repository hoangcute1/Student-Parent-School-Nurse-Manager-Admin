import HealthExaminationClassDetail from "../../../../_components/health-examination-class-detail";

interface Props {
  params: Promise<{
    eventId: string;
    classId: string;
  }>;
}

export default async function ClassDetailPage({ params }: Props) {
  const { eventId, classId } = await params;
  return <HealthExaminationClassDetail eventId={eventId} classId={classId} />;
}

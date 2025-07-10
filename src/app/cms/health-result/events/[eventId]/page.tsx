import HealthExaminationEventDetail from "../../_components/health-examination-event-detail";

interface Props {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { eventId } = await params;
  return <HealthExaminationEventDetail eventId={eventId} />;
}

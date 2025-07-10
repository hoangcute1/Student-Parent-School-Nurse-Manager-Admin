import HealthExaminationEventDetail from "../../_components/health-examination-event-detail";

interface Props {
  params: {
    eventId: string;
  };
}

export default function EventDetailPage({ params }: Props) {
  return <HealthExaminationEventDetail eventId={params.eventId} />;
}

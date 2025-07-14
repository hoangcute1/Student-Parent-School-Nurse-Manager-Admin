import VaccinationEventDetail from "../../_components/vaccination-event-detail";

interface Props {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { eventId } = await params;
  return <VaccinationEventDetail eventId={eventId} />;
} 
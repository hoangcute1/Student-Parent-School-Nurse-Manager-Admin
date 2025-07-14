import VaccinationClassDetail from "../../../_components/vaccination-class-detail";

interface Props {
  params: Promise<{
    eventId: string;
    classId: string;
  }>;
}

export default async function ClassDetailPage({ params }: Props) {
  const { eventId, classId } = await params;
  return <VaccinationClassDetail eventId={eventId} classId={classId} />;
}

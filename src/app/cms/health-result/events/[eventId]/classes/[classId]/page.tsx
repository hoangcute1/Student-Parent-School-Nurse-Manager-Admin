import HealthExaminationClassDetail from "../../../../_components/health-examination-class-detail";

interface Props {
  params: {
    eventId: string;
    classId: string;
  };
}

export default function ClassDetailPage({ params }: Props) {
  return (
    <HealthExaminationClassDetail
      eventId={params.eventId}
      classId={params.classId}
    />
  );
}

"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchData } from "@/lib/api/api";

export default function VaccinationClassDetailPage() {
  const { eventId, classId } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [classDetail, setClassDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchClassDetail() {
      setLoading(true);
      setError("");
      try {
        // Lấy thông tin event tổng thể
        const eventData = await fetchData(
          `/vaccination-schedules/events/${eventId}`
        );
        setEvent(eventData);
        // Lấy chi tiết lớp
        const classData = await fetchData(
          `/vaccination-schedules/events/${eventId}/classes/${classId}`
        );
        setClassDetail(classData);
      } catch (err: any) {
        setError(err.message || "Không thể tải chi tiết lớp");
      } finally {
        setLoading(false);
      }
    }
    if (eventId && classId) fetchClassDetail();
  }, [eventId, classId]);

  if (loading)
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!event || !classDetail)
    return <div className="p-8 text-center">Không tìm thấy dữ liệu</div>;

  // Lấy danh sách học sinh đã đồng ý
  const agreedStudents =
    classDetail.students?.filter((s: any) => {
      const st = String(s.status).toLowerCase();
      return st === "approved" || st === "agreed";
    }) || [];
  const totalAgreed = agreedStudents.length;
  const totalPending =
    classDetail.students?.filter(
      (s: any) => s.status === "PENDING" || s.status === "pending"
    ).length || 0;
  const totalRejected =
    classDetail.students?.filter(
      (s: any) => s.status === "REJECTED" || s.status === "rejected"
    ).length || 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="p-6 border mb-4">
        <div className="font-bold text-xl mb-2">
          Chi tiết lớp {classDetail.class_name}
        </div>
        <div className="text-sm text-gray-700 mb-2">Sự kiện: {event.title}</div>
        <div className="text-sm text-gray-700 mb-2">
          Ngày khám:{" "}
          {event.vaccination_date
            ? new Date(event.vaccination_date).toLocaleDateString()
            : "-"}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          Giờ khám: {event.vaccination_time || "-"}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          Địa điểm: {event.location}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          Loại khám: {event.vaccine_type || "-"}
        </div>
        <div className="mt-4">
          <button
            className="text-xs text-blue-600 underline"
            onClick={() =>
              router.push(`/cms/vaccination-management/event/${eventId}`)
            }
          >
            &larr; Xem chi tiết sự kiện khám
          </button>
        </div>
      </Card>
      <Card className="p-6 border">
        <div className="font-bold text-lg mb-2">
          Danh sách học sinh đã đồng ý khám
        </div>
        <div className="text-sm text-gray-500 mb-4">
          Chỉ hiển thị học sinh đã được phụ huynh đồng ý khám sức khỏe
        </div>
        {totalAgreed === 0 ? (
          <div className="text-center text-gray-600 py-8">
            <div className="font-semibold mb-2">
              Chưa có học sinh đồng ý khám
            </div>
            <div className="text-xs text-gray-500 mb-2">
              Học sinh sẽ hiển thị ở đây sau khi phụ huynh đồng ý khám sức khỏe
            </div>
            <div className="mt-4 text-sm">
              <span className="mr-4 text-green-600">
                Đã đồng ý: {totalAgreed}
              </span>
              <span className="mr-4 text-yellow-600">
                Chờ phản hồi: {totalPending}
              </span>
              <span className="text-red-600">Từ chối: {totalRejected}</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="p-2 border">Họ tên</th>
                  <th className="p-2 border">Lớp</th>
                  <th className="p-2 border">Trạng thái</th>
                  <th className="p-2 border">Phản hồi PH</th>
                  <th className="p-2 border">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {agreedStudents.map((s: any) => (
                  <tr
                    key={s.student?._id || s.student?.student_id}
                    className="text-center hover:bg-blue-50"
                  >
                    <td className="border p-2 font-semibold">
                      {s.student?.name}
                    </td>
                    <td className="border p-2">{classDetail.class_name}</td>
                    <td className="border p-2">
                      <Badge className="bg-green-100 text-green-800">
                        Đã đồng ý
                      </Badge>
                    </td>
                    <td className="border p-2">
                      {s.parent_response_notes || "-"}
                    </td>
                    <td className="border p-2">
                      {s.notes || s.rejection_reason || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-sm text-center">
              <span className="mr-4 text-green-600">
                Đã đồng ý: {totalAgreed}
              </span>
              <span className="mr-4 text-yellow-600">
                Chờ phản hồi: {totalPending}
              </span>
              <span className="text-red-600">Từ chối: {totalRejected}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

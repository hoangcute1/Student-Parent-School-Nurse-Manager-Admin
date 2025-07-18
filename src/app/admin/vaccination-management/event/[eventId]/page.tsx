"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import { fetchData } from "@/lib/api/api";

export default function VaccinationEventDetailPage() {
  const router = useRouter();
  const { eventId } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchData(
          `/vaccination-schedules/events/${eventId}`
        );
        setEvent(data);
      } catch (err: any) {
        setError(err.message || "Không thể tải chi tiết sự kiện");
      } finally {
        setLoading(false);
      }
    }
    if (eventId) fetchEvent();
  }, [eventId]);

  if (loading)
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!event)
    return <div className="p-8 text-center">Không tìm thấy sự kiện</div>;

  // Tổng hợp số liệu
  const totalStudents =
    event.classes?.reduce(
      (sum: number, c: any) => sum + (c.total_students || 0),
      0
    ) || 0;
  const agreed =
    event.classes?.reduce(
      (sum: number, c: any) => sum + (c.approved_count || 0),
      0
    ) || 0;
  const pending =
    event.classes?.reduce(
      (sum: number, c: any) => sum + (c.pending_count || 0),
      0
    ) || 0;
  const rejected =
    event.classes?.reduce(
      (sum: number, c: any) => sum + (c.rejected_count || 0),
      0
    ) || 0;
  const completed =
    event.classes?.reduce(
      (sum: number, c: any) => sum + (c.completed_count || 0),
      0
    ) || 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <button
        className="mb-4 text-blue-600 hover:underline"
        onClick={() => history.back()}
      >
        &larr; Quay lại danh sách
      </button>
      <h1 className="text-2xl font-bold mb-4">Chi tiết sự kiện tiêm chủng</h1>
      {/* Thông tin tổng quan */}
      <div className="bg-white rounded-xl shadow p-6 mb-4 border">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-blue-700" />
            {event.title}
          </span>
          <span className="text-gray-500 text-base font-normal">
            {event.description}
          </span>
        </div>
        <div className="flex flex-wrap gap-8 text-gray-700 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>
              {event.vaccination_date
                ? new Date(event.vaccination_date).toLocaleDateString()
                : "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full" />
            <span>{event.vaccination_time || "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{event.location}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-8 mt-2">
          <div className="flex flex-col items-center">
            <span className="text-blue-800 font-bold text-xl">
              {totalStudents}
            </span>
            <span className="text-xs text-gray-500 mt-1">Tổng học sinh</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-green-600 font-bold text-xl">{agreed}</span>
            <span className="text-xs text-gray-500 mt-1">Đã đồng ý</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-yellow-600 font-bold text-xl">{pending}</span>
            <span className="text-xs text-gray-500 mt-1">Chờ phản hồi</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-red-600 font-bold text-xl">{rejected}</span>
            <span className="text-xs text-gray-500 mt-1">Từ chối</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-purple-600 font-bold text-xl">
              {completed}
            </span>
            <span className="text-xs text-gray-500 mt-1">Hoàn thành</span>
          </div>
        </div>
      </div>
      {/* Danh sách lớp tham gia */}
      <div className="bg-white rounded-xl shadow p-6 border">
        <div className="flex items-center justify-between mb-2">
          <div className="font-bold text-lg">Danh sách lớp tham gia</div>
          <div className="text-sm text-gray-500">
            Theo dõi tình trạng thực hiện khám sức khỏe của từng lớp.{" "}
            <span className="text-blue-600 underline cursor-pointer">
              Click vào lớp để xem chi tiết học sinh.
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="p-2 border">Lớp</th>
                <th className="p-2 border">Tổng học sinh</th>
                <th className="p-2 border">Đã đồng ý</th>
                <th className="p-2 border">Chờ phản hồi</th>
                <th className="p-2 border">Từ chối</th>
                <th className="p-2 border">Hoàn thành</th>
                <th className="p-2 border">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {event.classes?.map((cls: any) => (
                <tr
                  key={cls.class_id}
                  className="text-center hover:bg-blue-50 cursor-pointer transition-all"
                  onClick={() =>
                    router.push(
                      `/admin/vaccination-management/event/${eventId}/class/${cls.class_id}`
                    )
                  }
                >
                  <td className="border p-2 font-semibold text-blue-800">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      {cls.class_name}
                    </span>
                    <div className="text-xs text-gray-500">
                      Khối {cls.grade_level}
                    </div>
                  </td>
                  <td className="border p-2">{cls.total_students}</td>
                  <td className="border p-2 text-green-600 font-bold">
                    {cls.approved_count}
                  </td>
                  <td className="border p-2 text-yellow-600 font-bold">
                    {cls.pending_count}
                  </td>
                  <td className="border p-2 text-red-600 font-bold">
                    {cls.rejected_count}
                  </td>
                  <td className="border p-2 text-purple-600 font-bold">
                    {cls.completed_count}
                  </td>
                  <td className="border p-2">
                    {cls.completed_count === cls.total_students &&
                    cls.total_students > 0 ? (
                      <Badge className="bg-green-100 text-green-800">
                        Hoàn thành (100%)
                      </Badge>
                    ) : (
                      <Badge variant="outline">Đang thực hiện</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

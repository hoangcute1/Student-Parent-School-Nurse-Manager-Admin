"use client";
import { useParentStudentsStore } from "@/stores/parent-students-store";
import Overall from "./_components/overall";
import RegularResultsPage from "./_components/regular-result";
import VaccinationResults from "./_components/vaccination-results";
import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Syringe, History } from "lucide-react";
import { fetchData } from "@/lib/api/api";
import { getHealthExaminationsCompleted } from "@/lib/api/health-examination";

export default function RegularResult() {
  const { fetchStudentsByParent, studentsData, isLoading } =
    useParentStudentsStore();
  const [activeTab, setActiveTab] = useState("health");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      setPageLoading(true);
      try {
        await fetchStudentsByParent();
      } finally {
        setPageLoading(false);
      }
    };

    initializeData();
  }, []); // Remove fetchStudentsByParent from dependency

  // Show loading skeleton while page is loading
  if (pageLoading || isLoading) {
    return (
      <div className="flex flex-col gap-12">
        <div className="space-y-8">
          <div className="flex flex-col space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
          </div>
          <div className="border-blue-100 bg-blue-50/30 rounded-lg p-6">
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="w-full">
          <div className="grid w-full grid-cols-3 gap-2 bg-blue-50 rounded-lg p-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <Overall />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2 bg-blue-50 rounded-lg p-1">
          <TabsTrigger
            value="health"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2 rounded-md text-center font-medium transition-all"
          >
            <Activity className="w-4 h-4 mr-2" />
            Kết quả khám sức khỏe
          </TabsTrigger>
          <TabsTrigger
            value="vaccination"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2 rounded-md text-center font-medium transition-all"
          >
            <Syringe className="w-4 h-4 mr-2" />
            Kết quả tiêm chủng
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2 rounded-md text-center font-medium transition-all"
          >
            <History className="w-4 h-4 mr-2" />
            Lịch sử khám và tiêm chủng
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="mt-6">
          <RegularResultsPage />
        </TabsContent>
        <TabsContent value="vaccination" className="mt-6">
          <VaccinationResults />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <HistoryComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Component hiển thị lịch sử khám và tiêm chủng
function HistoryComponent() {
  const { selectedStudent } = useParentStudentsStore();
  const [healthExaminations, setHealthExaminations] = useState<any[]>([]);
  const [vaccinationResults, setVaccinationResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchHistoryData = useCallback(async () => {
    if (!selectedStudent) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch health examinations using the correct API
      const healthData = await getHealthExaminationsCompleted(
        selectedStudent.student._id
      );

      // Fetch vaccination results using the correct API
      const vaccinationData = await fetchData<any[]>(
        `/vaccination-schedules/results/student/${selectedStudent.student._id}`
      );

      setHealthExaminations(healthData || []);
      setVaccinationResults(vaccinationData || []);
      setHasLoaded(true);
    } catch (err) {
      console.error("Error fetching history data:", err);
      setError("Không thể tải lịch sử khám và tiêm chủng");
    } finally {
      setLoading(false);
    }
  }, [selectedStudent?.student._id]);

  useEffect(() => {
    if (selectedStudent && !hasLoaded) {
      fetchHistoryData();
    }
  }, [selectedStudent, hasLoaded, fetchHistoryData]);

  // Transform health examination to unified format
  const transformHealthExamToHistory = (exam: any) => ({
    date: new Date(exam.examination_date).toLocaleDateString("vi-VN"),
    type: "Khám sức khỏe",
    subtype: exam.examination_type,
    doctor: exam.created_by?.full_name || exam.doctor_name || "Không xác định",
    result: exam.recommendations
      ? exam.recommendations.includes("bình thường") ||
        exam.recommendations.includes("tốt")
        ? "Bình thường"
        : "Cần theo dõi"
      : "Bình thường",
    notes: exam.examination_notes || "Không có ghi chú",
    location: exam.location || "Không xác định",
  });

  // Transform vaccination result to unified format
  const transformVaccinationToHistory = (v: any) => {
    let doctor = v.doctor_name || "Bác sĩ phụ trách sự kiện";
    if (v.vaccination_result) {
      try {
        const parsed = JSON.parse(v.vaccination_result);
        if (parsed.doctor_name) doctor = parsed.doctor_name;
      } catch {}
    }
    return {
      date: new Date(v.vaccination_date).toLocaleDateString("vi-VN"),
      type: "Tiêm chủng",
      subtype: v.title || v.vaccine_type || "",
      doctor,
      result: "Hoàn thành",
      notes: v.recommendations || v.vaccination_notes || "Không có ghi chú",
      location: v.location || "Không xác định",
    };
  };

  // Merge and sort all events by date descending
  const mergedHistory = [
    ...healthExaminations.map(transformHealthExamToHistory),
    ...vaccinationResults.map(transformVaccinationToHistory),
  ].sort((a, b) => {
    // Sort by date descending (dd/mm/yyyy)
    const [da, ma, ya] = a.date.split("/").map(Number);
    const [db, mb, yb] = b.date.split("/").map(Number);
    const dateA = new Date(ya, ma - 1, da).getTime();
    const dateB = new Date(yb, mb - 1, db).getTime();
    return dateB - dateA;
  });

  if (!selectedStudent) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Lịch sử khám và tiêm chủng
          </h1>
          <p className="text-blue-600">
            Xem lịch sử khám sức khỏe và tiêm chủng của học sinh.
          </p>
        </div>
        <div className="border-blue-100 bg-blue-50/30 rounded-lg p-6">
          <div className="text-center text-blue-600">
            Chưa có học sinh nào được chọn. Vui lòng chọn học sinh từ sidebar.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Lịch sử khám và tiêm chủng - {selectedStudent.student.name}
        </h1>
        <p className="text-blue-600">
          Xem lịch sử khám sức khỏe và tiêm chủng của học sinh.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
          <div className="border-blue-100 bg-blue-50/30 rounded-lg p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="border-red-200 bg-red-50/30 rounded-lg p-6">
          <div className="text-center text-red-600">{error}</div>
        </div>
      ) : mergedHistory.length === 0 ? (
        <div className="border-blue-100 bg-blue-50/30 rounded-lg p-6">
          <div className="text-center text-blue-600">
            Chưa có lịch sử khám hoặc tiêm chủng nào cho học sinh này.
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-200 px-4 py-2 text-left font-medium text-blue-800">
                  Ngày
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left font-medium text-blue-800">
                  Loại sự kiện
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left font-medium text-blue-800">
                  Chi tiết
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left font-medium text-blue-800">
                  Bác sĩ
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left font-medium text-blue-800">
                  Kết quả
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left font-medium text-blue-800">
                  Ghi chú
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left font-medium text-blue-800">
                  Địa điểm
                </th>
              </tr>
            </thead>
            <tbody>
              {mergedHistory.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">
                    {item.date}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {item.type}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {item.subtype}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {item.doctor}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.result === "Bình thường" ||
                        item.result === "Hoàn thành"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.result}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {item.notes}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {item.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

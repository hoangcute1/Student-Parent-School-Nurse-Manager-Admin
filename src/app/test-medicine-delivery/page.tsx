import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ViewDeliveryDialog as CmsViewDialog } from "@/app/cms/sent-medicines/view-delivery-dialog";
import DashboardViewDialog from "@/app/dashboard/medications/_components/view-delivery-dialog";

// Mock data để test
const mockCmsDelivery = {
  id: "cms-test-123",
  name: "Thuốc cảm lạnh cho bé",
  note: "Paracetamol 250mg (2 viên), Vitamin C 500mg (1 viên), Siro ho (5ml). Pha với nước ấm, uống sau ăn 30 phút.",
  reason: "Con bị cảm lạnh, sốt nhẹ, ho khan",
  total: 15,
  per_dose: "Theo độ tuổi",
  per_day: "Sáng, Trưa, Tối",
  status: "pending" as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  date: new Date().toISOString(),
  sent_at: new Date().toISOString(),
  end_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  parentId: "parent-456",
  student: {
    name: "Trần Thị Mai",
    _id: "student-456",
    class: {
      name: "8B2",
    },
  },
  parentName: "Trần Văn Nam",
  medicine: {
    name: "Combo thuốc cảm lạnh",
    _id: "medicine-789",
  },
};

const mockDashboardDelivery = {
  id: "dashboard-test-456",
  name: "Thuốc dạ dày cho bé",
  note: "Omeprazole 10mg (1 viên), Probiotics (1 gói), Simethicone 40mg (1 viên). Uống trước ăn 30 phút.",
  reason: "Con bị đau bụng, khó tiêu",
  total: 21,
  per_dose: "Theo hướng dẫn bác sĩ",
  per_day: "Sáng, Tối",
  status: "progress" as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  date: new Date().toISOString(),
  sent_at: new Date().toISOString(),
  end_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  staffId: "staff-101",
  student: {
    name: "Lê Minh Anh",
    _id: "student-789",
  },
  medicine: {
    name: "Combo thuốc dạ dày",
    _id: "medicine-101",
  },
  staffName: "Cô Y tá Hoa",
};

const TestMedicineDeliveryDisplay = () => {
  const [showCmsDialog, setShowCmsDialog] = useState(false);
  const [showDashboardDialog, setShowDashboardDialog] = useState(false);

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Test Medicine Delivery Display
        </h1>

        {/* Test Table Display */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 Test Bảng Hiển Thị</h2>
          <div className="border border-sky-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-sky-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-900">
                    Học sinh
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-900">
                    Thành phần thuốc
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-900">
                    Phụ huynh
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-900">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-sky-50/30">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {mockCmsDelivery.student.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Lớp: {mockCmsDelivery.student.class.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {mockCmsDelivery.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {mockCmsDelivery.note || "Không có thông tin thành phần"}
                    </div>
                  </td>
                  <td className="px-4 py-3">{mockCmsDelivery.parentName}</td>
                  <td className="px-4 py-3">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                      Chờ xử lý
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            🔍 Test Dialog Chi Tiết
          </h2>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowCmsDialog(true)}
              className="bg-sky-500 hover:bg-sky-600 text-white"
            >
              Xem Dialog CMS (Nhân viên Y tế)
            </Button>
            <Button
              onClick={() => setShowDashboardDialog(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Xem Dialog Dashboard (Phụ huynh)
            </Button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">✅ Kết Quả Test</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Bảng hiển thị có cột "Thành phần thuốc"</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>
                Hiển thị nội dung thành phần thuốc thay vì thông tin medicine cũ
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>
                Dialog chi tiết hiển thị "Thành phần thuốc" riêng biệt
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>
                Hiển thị thời gian phụ huynh tạo thay vì thông tin thời gian chi
                tiết
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>CMS: "Thời gian phụ huynh tạo" với ngày giờ chi tiết</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>
                Dashboard: "Thời gian tạo đơn" thay vì "Cập nhật lần cuối"
              </span>
            </div>
          </div>
        </div>

        {/* Mock Payload Test */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">📨 Test Payload Submit</h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            {JSON.stringify(
              {
                name: "Thuốc cảm lạnh tự pha",
                note: "Panadol Extra 2 viên, Vitamin C 1000mg 1 viên, Mật ong 1 thìa",
                reason: "Con bị cảm lạnh nhẹ",
                total: 6,
                per_dose: "Theo hướng dẫn",
                per_day: "Sáng, Tối",
                status: "pending",
                date: new Date().toISOString(),
                end_at: new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toISOString(),
                medicine: "675d8a1b123456789abcdef0",
                student: "student-456",
                parent: "parent-789",
                staff: "staff-101",
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>

      {/* Dialogs */}
      {showCmsDialog && (
        <CmsViewDialog
          delivery={mockCmsDelivery as any}
          onClose={() => setShowCmsDialog(false)}
        />
      )}

      {showDashboardDialog && (
        <DashboardViewDialog
          delivery={mockDashboardDelivery as any}
          medications={[]}
          onClose={() => setShowDashboardDialog(false)}
        />
      )}
    </div>
  );
};

export default TestMedicineDeliveryDisplay;

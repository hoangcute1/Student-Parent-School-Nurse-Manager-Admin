import { Card } from "@/components/ui/card";

export default function ParentEmergencyNotificationDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full border-red-500 bg-red-50 shadow-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-4xl text-red-600 animate-pulse">🚨</span>
          <h2 className="text-2xl font-bold text-red-700">KHẨN CẤP: SỰ CỐ Y TẾ CỦA Nguyễn Văn A</h2>
        </div>
        <div className="text-gray-800 mb-4 space-y-1">
          <div><b>Thời gian:</b> 10:30 12/06/2025</div>
          <div><b>Địa điểm:</b> Sân trường</div>
          <div><b>Mức độ:</b> <span className="text-red-600 font-bold">KHẨN CẤP</span></div>
          <div><b>Mô tả:</b> Ngã cầu thang, chảy máu nhiều ở đầu gối.</div>
          <div><b>Hành động đã thực hiện:</b> Sơ cứu, cầm máu, chuẩn bị chuyển viện.</div>
          <div><b>Chuyển viện:</b> Có - Bệnh viện Nhi Đồng 1</div>
          <div><b>Người báo cáo:</b> Nguyễn Thị Y tế</div>
          <div><b>Ghi chú khẩn cấp:</b> Đã gọi cho phụ huynh, đề nghị đến bệnh viện ngay.</div>
        </div>
        <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded text-red-700 font-semibold mb-4">
          Vui lòng liên hệ ngay với phòng y tế: <a href="tel:0123456789" className="underline">0123 456 789</a>
        </div>
        <div className="flex justify-end">
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded shadow">
            Tôi đã nhận thông báo
          </button>
        </div>
      </Card>
    </div>
  );
} 
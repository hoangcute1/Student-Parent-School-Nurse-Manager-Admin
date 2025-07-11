"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Bell,
  CheckCircle,
  ClipboardList,
  Users,
  Syringe,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export default function VaccinationScheduleWorkflow() {
  const workflowSteps = [
    {
      id: 1,
      title: "Nhân viên y tế tạo lịch tiêm",
      description:
        "Tạo lịch tiêm chủng cho học sinh tại trang CMS /cms/vaccinations",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      actions: [
        "Điền thông tin lịch tiêm (tiêu đề, mô tả, ngày giờ)",
        "Chọn học sinh cần tiêm",
        "Nhập thông tin bác sĩ và địa điểm",
        "Chọn loại vắc-xin",
        "Nhấn 'Tạo lịch tiêm'",
      ],
    },
    {
      id: 2,
      title: "Hệ thống gửi thông báo",
      description: "Tự động gửi thông báo đến phụ huynh về lịch tiêm chủng mới",
      icon: Bell,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      actions: [
        "Hệ thống tự động tìm phụ huynh của học sinh",
        "Tạo thông báo trong database",
        "Thông báo xuất hiện tại /dashboard/events",
        "Phụ huynh nhận thông báo real-time",
      ],
    },
    {
      id: 3,
      title: "Phụ huynh xem và phản hồi",
      description: "Phụ huynh xem thông báo và quyết định đồng ý hay từ chối",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      actions: [
        "Đăng nhập vào dashboard phụ huynh",
        "Vào tab 'Lịch tiêm chủng' tại /dashboard/events",
        "Xem chi tiết lịch tiêm",
        "Chọn 'Đồng ý' hoặc 'Từ chối' với lý do",
      ],
    },
    {
      id: 4,
      title: "Cập nhật kết quả",
      description:
        "Hệ thống cập nhật trạng thái dựa trên phản hồi của phụ huynh",
      icon: ClipboardList,
      color: "text-green-600",
      bgColor: "bg-green-100",
      actions: [
        "Nếu đồng ý: Lịch tiêm chuyển sang trạng thái 'Đã đồng ý'",
        "Nếu từ chối: Lịch tiêm chuyển sang trạng thái 'Đã từ chối'",
        "Nhân viên y tế theo dõi kết quả tại CMS",
        "Chỉ những lịch tiêm được đồng ý mới được lưu lại",
      ],
    },
    {
      id: 5,
      title: "Thực hiện tiêm chủng",
      description: "Nhân viên y tế tiến hành tiêm và cập nhật kết quả",
      icon: Syringe,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      actions: [
        "Tiến hành tiêm chủng cho học sinh đã đồng ý",
        "Cập nhật kết quả tiêm",
        "Ghi chú phản ứng sau tiêm (nếu có)",
        "Lưu thông tin vào hồ sơ sức khỏe",
        "Gửi kết quả về cho phụ huynh",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800">
            Luồng hoạt động quản lý tiêm chủng
          </CardTitle>
          <CardDescription>
            Quy trình từ tạo lịch tiêm đến hoàn thành tiêm chủng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connection line */}
                {index < workflowSteps.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-200"></div>
                )}

                <div className="flex items-start space-x-4">
                  {/* Step icon */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full ${step.bgColor} flex items-center justify-center`}
                  >
                    <step.icon className={`w-6 h-6 ${step.color}`} />
                  </div>

                  {/* Step content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {step.title}
                      </h3>
                      <Badge variant="outline">Bước {step.id}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{step.description}</p>

                    {/* Actions list */}
                    <div className="space-y-2">
                      {step.actions.map((action, actionIndex) => (
                        <div
                          key={actionIndex}
                          className="flex items-start space-x-2"
                        >
                          <ArrowRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important notes */}
      <Card>
        <CardHeader>
          <CardTitle>Lưu ý quan trọng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p>
                Chỉ những lịch tiêm được phụ huynh đồng ý mới được lưu lại trong
                hệ thống
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p>
                Phụ huynh có thể xem chi tiết lịch tiêm trước khi quyết định
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p>
                Kết quả tiêm chủng sẽ được gửi về cho phụ huynh trong mục kết
                quả tiêm
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p>
                Những phụ huynh không đồng ý sẽ bị bỏ qua, không tiến hành tiêm
                chủng
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System features */}
      <Card>
        <CardHeader>
          <CardTitle>Tính năng hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">Cho nhân viên y tế:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Tạo lịch tiêm với đầy đủ thông tin</li>
                <li>• Tìm kiếm và chọn học sinh</li>
                <li>• Xem danh sách tất cả lịch tiêm đã tạo</li>
                <li>• Theo dõi trạng thái phản hồi từ phụ huynh</li>
                <li>• Cập nhật kết quả tiêm chủng</li>
                <li>• Xóa lịch tiêm chưa được phản hồi</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">Cho phụ huynh:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Nhận thông báo lịch tiêm tự động</li>
                <li>• Xem chi tiết thông tin lịch tiêm</li>
                <li>• Đồng ý hoặc từ chối với ghi chú</li>
                <li>• Theo dõi trạng thái phản hồi</li>
                <li>• Xem kết quả tiêm chủng</li>
                <li>• Nhận thông báo phản ứng sau tiêm</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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
  XCircle,
  ArrowRight,
  User,
  UserCheck,
  Stethoscope,
  ClipboardList,
} from "lucide-react";

export default function HealthExaminationWorkflow() {
  const workflowSteps = [
    {
      id: 1,
      title: "Nhân viên y tế tạo lịch khám",
      description:
        "Tạo lịch khám sức khỏe cho học sinh tại trang CMS /cms/health-result",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      actions: [
        "Điền thông tin lịch khám (tiêu đề, mô tả, ngày giờ)",
        "Chọn học sinh cần khám",
        "Nhập thông tin bác sĩ và địa điểm",
        "Nhấn 'Tạo lịch khám'",
      ],
    },
    {
      id: 2,
      title: "Hệ thống gửi thông báo",
      description: "Tự động gửi thông báo đến phụ huynh của học sinh được chọn",
      icon: Bell,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      actions: [
        "Hệ thống tự động tìm phụ huynh của học sinh",
        "Tạo thông báo trong database",
        "Thông báo hiển thị tại /dashboard/events tab 'Lịch khám sức khỏe'",
      ],
    },
    {
      id: 3,
      title: "Phụ huynh xem và phản hồi",
      description: "Phụ huynh xem thông báo và chọn đồng ý hoặc từ chối",
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      actions: [
        "Đăng nhập vào dashboard phụ huynh",
        "Vào tab 'Lịch khám sức khỏe' tại /dashboard/events",
        "Xem chi tiết lịch khám",
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
        "Nếu đồng ý: Lịch khám chuyển sang trạng thái 'Đã đồng ý'",
        "Nếu từ chối: Lịch khám chuyển sang trạng thái 'Đã từ chối'",
        "Nhân viên y tế xem kết quả tại /cms/health-result",
        "Chỉ những lịch khám được đồng ý mới được lưu lại",
      ],
    },
  ];

  const statusExplanations = [
    {
      status: "Chờ phản hồi",
      description: "Thông báo đã được gửi, chờ phụ huynh phản hồi",
      icon: Calendar,
      color: "text-yellow-600 bg-yellow-100",
    },
    {
      status: "Đã đồng ý",
      description: "Phụ huynh đã đồng ý cho con tham gia lịch khám",
      icon: CheckCircle,
      color: "text-green-600 bg-green-100",
    },
    {
      status: "Đã từ chối",
      description: "Phụ huynh đã từ chối, lịch khám sẽ không được thực hiện",
      icon: XCircle,
      color: "text-red-600 bg-red-100",
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-blue-600" />
            Luồng hoạt động: Quản lý lịch khám sức khỏe
          </CardTitle>
          <CardDescription>
            Hướng dẫn chi tiết về quy trình tạo lịch khám và xử lý phản hồi từ
            phụ huynh
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quy trình 4 bước</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className="flex gap-4">
                    <div
                      className={`rounded-full p-3 ${step.bgColor} flex-shrink-0`}
                    >
                      <Icon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Bước {step.id}
                        </Badge>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-3">{step.description}</p>
                      <ul className="space-y-1">
                        {step.actions.map((action, actionIndex) => (
                          <li
                            key={actionIndex}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <ArrowRight className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <div className="flex justify-center mt-8">
                        <ArrowRight className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trạng thái lịch khám</CardTitle>
            <CardDescription>
              Các trạng thái khác nhau của lịch khám trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {statusExplanations.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <Badge className={item.color}>
                      <Icon className="w-3 h-3 mr-1" />
                      {item.status}
                    </Badge>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lưu ý quan trọng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>
                  Chỉ những lịch khám được phụ huynh đồng ý mới được lưu lại
                  trong hệ thống
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>
                  Phụ huynh có thể xem chi tiết lịch khám trước khi quyết định
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Nhân viên y tế có thể xóa lịch khám chưa được phản hồi</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Hệ thống tự động gửi thông báo ngay sau khi tạo lịch khám</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

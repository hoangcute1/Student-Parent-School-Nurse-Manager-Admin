import {
  BookOpen,
  Calendar,
  FileText,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";

const features = [
  {
    title: "Khai báo sức khỏe",
    description: "Quản lý thông tin sức khỏe học sinh",
    content:
      "Phụ huynh có thể khai báo dị ứng, bệnh mãn tính, tiền sử điều trị, thị lực, thính lực, tiêm chủng và các thông tin sức khỏe khác.",
    icon: FileText,
    href: "/dashboard/health-declaration",
    textColor: "text-blue-500",
    borderColor: "border-blue-500",
    bgGradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Gửi thuốc",
    description: "Quản lý thuốc cho học sinh",
    content:
      "Phụ huynh có thể gửi thuốc cho trường, theo dõi việc sử dụng thuốc của con.",
    icon: Shield,
    href: "/dashboard/medications",
    textColor: "text-red-500",
    borderColor: "border-red-500",
    bgGradient: "from-red-500 to-red-600",
  },
  {
    title: "Nhận kết quả",
    description: "Xem kết quả khám sức khỏe",
    content:
      "Xem kết quả khám sức khỏe định kỳ và các chỉ số sức khỏe của học sinh.",
    icon: Calendar,
    href: "/dashboard/profile",
    textColor: "text-green-500",
    borderColor: "border-green-500",
    bgGradient: "from-green-500 to-green-600",
  },
  {
    title: "Lịch sử bệnh án",
    description: "Thông tin và hướng dẫn",
    content:
      "Truy cập tài liệu về sức khỏe học đường, hướng dẫn phòng bệnh và các thông tin y tế quan trọng khác.",
    icon: BookOpen,
    href: "/dashboard/resources",
    textColor: "text-purple-500",
    borderColor: "border-purple-500",
    bgGradient: "from-purple-500 to-purple-600",
  },
  {
    title: "Thông báo & Sự kiện",
    description: "Kết nối phụ huynh và nhà trường",
    content:
      "Hệ thống liên lạc giữa phụ huynh và nhân viên y tế, đặt lịch tư vấn và thông báo kết quả kiểm tra.",
    icon: MessageSquare,
    href: "/dashboard/events",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500",
    bgGradient: "from-yellow-500 to-yellow-600",
  },
  {
    title: "Xem phản hồi",
    description: "Theo dõi và cấp phát thuốc",
    content:
      "Phụ huynh có thể gửi thuốc cho trường, nhân viên y tế quản lý và cấp phát thuốc theo chỉ định.",
    icon: Users,
    href: "/dashboard/feedback",
    textColor: "text-orange-500",
    borderColor: "border-orange-500",
    bgGradient: "from-orange-500 to-orange-600",
  },
];

export { features };

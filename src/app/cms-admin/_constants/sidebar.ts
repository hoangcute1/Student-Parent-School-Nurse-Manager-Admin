import {
  Home,
  Users,
  Box,
  Pill,
  Heart,
  ClipboardCheck,
  Syringe,
  FileText,
  BarChart3,
  Eye,
  Shield,
} from "lucide-react";

const navLinks = [
  { 
    href: "/cms-admin", 
    icon: Home, 
    label: "Tổng quan", 
    description: "Dashboard tổng quan hệ thống" 
  },
  {
    href: "/cms-admin/view-students",
    icon: Users,
    label: "Xem học sinh",
    description: "Danh sách tất cả học sinh",
  },
  {
    href: "/cms-admin/view-medications",
    icon: Box,
    label: "Xem kho thuốc",
    description: "Thông tin tất cả thuốc",
  },
  {
    href: "/cms-admin/view-sent-medicines",
    icon: Pill,
    label: "Xem thuốc gửi",
    description: "Tất cả đơn thuốc từ phụ huynh",
  },
  {
    href: "/cms-admin/view-health-result",
    icon: Heart,
    label: "Xem sức khỏe",
    description: "Kết quả khám sức khỏe",
  },
  {
    href: "/cms-admin/view-events",
    icon: ClipboardCheck,
    label: "Xem sự cố y tế",
    description: "Tất cả sự cố y tế",
  },
  {
    href: "/cms-admin/view-vaccinations",
    icon: Syringe,
    label: "Xem tiêm chủng",
    description: "Thông tin tiêm chủng",
  },
  {
    href: "/cms-admin/view-reports",
    icon: BarChart3,
    label: "Xem báo cáo",
    description: "Báo cáo tổng hợp",
  },
];

export { navLinks };

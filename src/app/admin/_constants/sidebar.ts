import EventsPage from "@/app/dashboard/events/page";
import { warning } from "framer-motion";
import {
  Box,
  ClipboardCheck,
  Heart,
  Home,
  MessageCircleMore,
  Pill,
  Speech,
  Syringe,
  Users,
} from "lucide-react";

const adminNavLinks = [
  {
    href: "/admin/manage-parents",
    icon: Users,
    label: "Quản lý phụ huynh",
    description: "Quản lý phụ huynh",
  },
  {
    href: "/admin/manage-staffs",
    icon: Users,
    label: "Quản lý nhân viên",
    description: "Quản lý nhân viên",
  },
];

const navLinks = [
  {
    href: "/admin/manage-students",
    icon: Users,
    label: "Quản lý học sinh",
    description: "Quản lý học sinh",
  },
  {
    href: "/admin/medications",
    icon: Box,
    label: "Quản lý Kho Thuốc ",
    description: "Thông tin thuốc",
  },
  {
    href: "/admin/sent-medicines",
    icon: Pill,
    label: "Phụ huynh gửi thuốc",
    description: "Sự kiện thuốc",
  },
  {
    href: "/admin/health-result",
    icon: Heart,
    label: "Quản lý Khám sức khỏe",
    description: "Theo dõi sức khỏe định kỳ",
  },

  {
    href: "/admin/events",
    icon: ClipboardCheck,
    label: "Sự cố y tế",
    description: "Xử lý y tế khẩn cấp",
  },
  {
    href: "/admin/vaccination-management",
    icon: Syringe,
    label: "Quản lý tiêm chủng ",
    description: "Giám sát tiêm chủng",
  },

  {
    href: "/admin/responses",
    icon: MessageCircleMore,
    label: "Quản lý phản hổi",
    description: "phản hồi từ phụ huynh",
  },
];

export { navLinks, adminNavLinks };

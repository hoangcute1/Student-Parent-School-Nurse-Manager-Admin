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
    href: "/cmscopy/manage-parents",
    icon: Users,
    label: "Quản lý phụ huynh",
    description: "Quản lý phụ huynh",
  },
  {
    href: "/cmscopy/manage-staffs",
    icon: Users,
    label: "Quản lý nhân viên",
    description: "Quản lý nhân viên",
  },
];

const navLinks = [
  {
    href: "/cmscopy/manage-students",
    icon: Users,
    label: "Quản lý học sinh",
    description: "Quản lý học sinh",
  },
  {
    href: "/cmscopy/medications",
    icon: Box,
    label: "Quản lý Kho Thuốc ",
    description: "Thông tin thuốc",
  },
  {
    href: "/cmscopy/sent-medicines",
    icon: Pill,
    label: "Phụ huynh gửi thuốc",
    description: "Sự kiện thuốc",
  },
  {
    href: "/cmscopy/health-result",
    icon: Heart,
    label: "Quản lý Khám sức khỏe",
    description: "Theo dõi sức khỏe định kỳ",
  },
  
  {
    href: "/cmscopy/events",
    icon: ClipboardCheck,
    label: "Sự kiện y tế",
    description: "Xử lý y tế khẩn cấp",
  },
  {
    href: "/cmscopy/vaccinations",
    icon: Syringe,
    label: "Quản lý tiêm chủng ",
    description: "Giám sát tiêm chủng",
  },

  {
    href: "/cmscopy/responses",
    icon: MessageCircleMore,
    label: "Quản lý phản hổi",
    description: "phản hồi từ phụ huynh",
  },
];

export { navLinks, adminNavLinks };

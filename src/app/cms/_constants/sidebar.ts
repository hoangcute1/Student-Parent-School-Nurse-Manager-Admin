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

const navLinks = [
  {
    href: "/cms/manage-students",
    icon: Users,
    label: "Quản lý học sinh",
    description: "Quản lý học sinh",
  },
  {
    href: "/cms/medications",
    icon: Box,
    label: "Quản lý Kho Thuốc ",
    description: "Thông tin thuốc",
  },
  {
    href: "/cms/sent-medicines",
    icon: Pill,
    label: "Phụ huynh gửi thuốc",
    description: "Sự kiện thuốc",
  },
  {
    href: "/cms/health-result",
    icon: Heart,
    label: "Quản lý Khám sức khỏe",
    description: "Theo dõi sức khỏe định kỳ",
  },

  {
    href: "/cms/events",
    icon: ClipboardCheck,
    label: "Sự cố y tế",
    description: "Xử lý y tế khẩn cấp",
  },
  {
    href: "/cms/vaccination-management",
    icon: Syringe,
    label: "Quản lý tiêm chủng ",
    description: "Giám sát tiêm chủng",
  },

  {
    href: "/cms/responses",
    icon: MessageCircleMore,
    label: "Quản lý phản hổi",
    description: "phản hồi từ phụ huynh",
  },
];

export { navLinks };

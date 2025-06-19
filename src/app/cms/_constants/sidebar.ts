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
    href: "/cms/manage-parents",
    icon: Users,
    label: "Quản lý phụ huynh",
    description: "Quản lý phụ huynh",
  },
  {
    href: "/cms/manage-staffs",
    icon: Users,
    label: "Quản lý nhân viên",
    description: "Quản lý nhân viên",
  },
];

const navLinks = [
  { href: "/cms", icon: Home, label: "Tổng quát", description: "Tổng quát" },
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
    description: "Sự kiện thuốc",
  },
  {
    href: "/cms/sent-medicines",
    icon: Pill,
    label: "Thuốc gửi từ phụ huynh ",
    description: "Sự kiện thuốc",
  },
  {
    href: "/cms/health-result",
    icon: Heart,
    label: "Kết quả khám",
    description: "Kết quả khám",
  },
  
  {
    href: "/cms/events",
    icon: ClipboardCheck,
    label: "Sự kiện y tế",
    description: "Sự kiện y tế",
  },
  {
    href: "/cms/vaccinations",
    icon: Syringe,
    label: "Sự kiện tiêm chủng",
    description: "Sự kiện tiêm chủng",
  },

  {
    href: "/cms/responses",
    icon: MessageCircleMore,
    label: "Quản lý phản hổi",
    description: "Quản lý phản hồi",
  },
];

export { navLinks, adminNavLinks };

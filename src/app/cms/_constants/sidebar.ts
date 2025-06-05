import { Heart, Home, Users } from "lucide-react";

const navLinks = [
  { href: "/cms", 
    icon: Home, 
    label: "Tổng quát", 
    description: "Tổng quát" },
  {
    href: "/cms/health-records",
    icon: Heart,
    label: "Hồ sơ sức khỏe",
    description: "Quản lý hồ sơ sức khỏe",
  },
  {
    href: "/cms/events",
    icon: Users,
    label: "Sự kiện y tế",
    description: "Sự kiện y tế",
  },
  {
    href: "/cms/vaccinations",
    icon: Heart,
    label: "Sự kiện tiêm chủng",
    description: "Sự kiện tiêm chủng",
  },
  {
    href: "/cms/medications",
    icon: Heart,
    label: "Sự kiện thuốc",
    description: "Sự kiện thuốc",
  },
  {
    href: "/cms/responses",
    icon: Heart,
    label: "Quản lý phản hổi",
    description: "Quản lý phản hồi",
  },

];

export { navLinks };

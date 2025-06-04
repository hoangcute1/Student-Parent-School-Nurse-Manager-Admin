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
    label: "Su kien y te",
    description: "Sự kiện y tế",
  },
  {
    href: "/cms/vaccinations",
    icon: Heart,
    label: "Sự kiện tiêm chủng",
    description: "Sự kiện tiêm chủng",
  },
];

export { navLinks };

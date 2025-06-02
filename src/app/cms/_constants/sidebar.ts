import { Heart, Home, Users } from "lucide-react";

const navLinks = [
  { href: "/cms", icon: Home, label: "Tổng quát" },
  { href: "/cms/health-records", icon: Heart, label: "Hồ sơ sức khỏe" },
  { href: "/cms/events", icon: Users, label: "Su kien y te" },
  { href: "/cms/vaccinations", icon: Heart, label: "Su kien tiem chung" },
];

export { navLinks };

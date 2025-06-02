import { Heart, Home, Users } from "lucide-react";

const parentNav = [
  {
    href: "/dashboard/health-records",
    icon: Heart,
    label: "Tổng hợp hồ sơ",
    description: "Tổng hợp thông tin con em",
  },
  {
    href: "/dashboard/medications",
    icon: Heart,
    label: "Gửi thuốc",
    description: "Mục gửi thuốc",
  },
    {
    href: "/dashboard/events",
    icon: Heart,
    label: "Sự kiện y tế",
    description: "Sự kiện y tế và thông báo",
  },
];
const studentNav = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Thông tin cá nhân",
    description: "Trang sức khoẻ cá nhân",
  },
  {
    href: "/dashboard/health-results",
    icon: Heart,
    label: "Kết quả khám",
    description: "kết quả khám của con em",
  },
  {
    href: "/dashboard/resources",
    icon: Users,
    label: "Lịch sử bệnh án",
    description: "Lịch sử bệnh án",
  },

  {
    href: "/dashboard/feedback",
    icon: Heart,
    label: "Phan hoi",
    description: "Gửi phản hồi và ý kiến",
  },
];

export { parentNav, studentNav };

import { Heart, Home } from "lucide-react";



const parentNav = [
  {
    href: "/dashboard/medications",
    icon: Heart,
    label: "Gui thuoc",
    description: "Gửi thuốc cho con em",
  },
];
const studentNav = [
  { href: "/dashboard", icon: Home, label: "Tổng quát" },
  {
    href: "/dashboard/health-records",
    icon: Heart,
    label: "Hồ sơ sức khỏe",
    description: "Trang chủ và thông tin con em",
  },

  {
    href: "/dashboard/health-results",
    icon: Heart,
    label: "Ket qua kham",
    description: "kết quả khám của con em",
  },
  // {
  //   href: "/dashboard/resources",
  //   icon: Users,
  //   label: "Lich su benh an",
  //   description: "Thông tin và hướng dẫn sức khỏe",
  // },
  // {
  //   href: "/dashboard/events",
  //   icon: Heart,
  //   label: "Su kien y te",
  //   description: "Sự kiện y tế và thông báo",
  // },
  // {
  //   href: "/dashboard/feedback",
  //   icon: Heart,
  //   label: "Phan hoi",
  //   description: "Gửi phản hồi và ý kiến",
  // },
]

export { parentNav, studentNav };
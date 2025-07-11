import { Bell, BookmarkCheck, ContactRound, Heart, Home, House, MessageCircle, Pill, UserRoundPen, Users } from "lucide-react";

const parentNav = [
  {
    href: "/dashboard/health-declaration",
    icon: UserRoundPen,
    label: "Khai báo sức khoẻ ",
    description: "Thông tin sức khỏe học sinh",
  },
  {
    href: "/dashboard/medications",
    icon: Pill,
    label: "Gửi thuốc",
    description: "Theo dõi thuốc học sinh",
  },
  

];
const studentNav = [
  {
    href: "/dashboard/profile",
    icon: ContactRound,
    label: "Thông tin cá nhân",
    description: "",
  },
  {
    href: "/dashboard/resources",
    icon: Users,
    label: "Lịch sử bệnh án",
    description: "",
  },

  {
    href: "/dashboard/feedback",
    icon: MessageCircle,
    label: "Gửi phản hồi",
    description: "Gửi phản hồi và ý kiến",
  },
  {
    href: "/dashboard/events",
    icon: Bell,
    label: "Thông báo",
    description: "",
  },
];

export { parentNav, studentNav };

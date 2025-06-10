import { BookmarkCheck, ContactRound, Heart, Home, House, MessageCircle, Pill, UserRoundPen, Users } from "lucide-react";

const parentNav = [
  {
    href: "/dashboard/health-declaration",
    icon: UserRoundPen,
    label: "Khai báo sức khoẻ ",
    description: " khái báo sức khoẻ học sinh",
  },
  {
    href: "/dashboard/medications",
    icon: Pill,
    label: "Gửi thuốc",
    description: "Mục gửi thuốc",
  },
  {
    href: "/dashboard/events",
    icon: BookmarkCheck,
    label: "Sự kiện y tế",
    description: "Sự kiện y tế và thông báo",
  },
  

];
const studentNav = [
  {
    href: "/dashboard/profile",
    icon: ContactRound,
    label: "Thông tin cá nhân",
    description: "Trang sức khoẻ cá nhân",
  },
  {
    href: "/dashboard/resources",
    icon: Users,
    label: "Lịch sử bệnh án",
    description: "Lịch sử bệnh án",
  },

  {
    href: "/dashboard/feedback",
    icon: MessageCircle,
    label: "Phản hồi",
    description: "Gửi phản hồi và ý kiến",
  },
];

export { parentNav, studentNav };

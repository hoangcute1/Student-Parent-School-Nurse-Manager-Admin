import { BookmarkCheck, ContactRound, Heart, Home, House, MessageCircle, Pill, UserRoundPen, Users } from "lucide-react";

const parentNav = [
  {
    href: "/dashboard/health-declaration",
    icon: UserRoundPen,
    label: "Khai báo sức khoẻ ",
    description: " khái báo sức khoẻ của con",
  },
  {
    href: "/dashboard/medications",
    icon: Pill,
    label: "Gửi thuốc",
    description: "Gửi thuốc cho con",
  },
  {
    href: "/dashboard/events",
    icon: BookmarkCheck,
    label: "Thông báo sự kiện",
    description: "Sự kiện y tế của nhà trường",
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
    description: "Hồ sơ bệnh án học sinh",
  },

  {
    href: "/dashboard/feedback",
    icon: MessageCircle,
    label: "Gửi phản hồi",
    description: "Gửi phản hồi và ý kiến",
  },
];

export { parentNav, studentNav };

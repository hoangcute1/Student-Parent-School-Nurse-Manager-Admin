import { Heart, Info, Shield } from "lucide-react";

const resources = [
  {
    title: "Hướng dẫn phòng bệnh mùa học",
    description: "Các biện pháp phòng ngừa bệnh tật trong năm học mới",
    image: "/resources/prevention-guide.jpg",
    date: "2023-12-05",
    author: "BS. Nguyễn Thị D",
    icon: Shield,
    iconColor: "text-blue-600",
    href: "/documents/prevention-guide",
  },
  {
    title: "Dinh dưỡng học đường",
    description: "Chế độ dinh dưỡng cân đối cho học sinh các cấp",
    image: "/resources/nutrition-guide.jpg",
    date: "2023-12-03",
    author: "TS. Phạm Văn E",
    icon: Heart,
    iconColor: "text-blue-600",
    href: "/documents/school-nutrition",
  },
  {
    title: "Sức khỏe tâm lý học sinh",
    description:
      "Nhận biết và hỗ trợ vấn đề tâm lý ở trẻ em và thanh thiếu niên",
    image: "/resources/mental-health.jpg",
    date: "2023-12-01",
    author: "ThS. Trần Thị F",
    icon: Info,
    iconColor: "text-blue-600",
    href: "/documents/mental-health",
  },
  {
    title: "8 Nguyên tắc phòng tránh điện giật cho trẻ em",
    description: "Hướng dẫn chi tiết về an toàn điện cho trẻ trong mùa hè",
    image: "/resources/electrical-safety.jpg",
    date: "2023-12-10",
    author: "ThS. Nguyễn Văn X",
    icon: Shield,
    iconColor: "text-blue-600",
    href: "/documents/electrical-safety",
  },
];

export { resources };

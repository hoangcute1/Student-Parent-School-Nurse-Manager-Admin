import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthData } from "@/lib/auth";
import {
  BookOpen,
  Calendar,
  FileText,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import LoginPopup from "./login-popup";
import { useRouter } from "next/navigation";

const features = [
  {
    title: "Khai báo hồ sơ sức khỏe",
    description: "Quản lý thông tin sức khỏe học sinh",
    content:
      "Phụ huynh có thể khai báo dị ứng, bệnh mãn tính, tiền sử điều trị, thị lực, thính lực, tiêm chủng và các thông tin sức khỏe khác.",
    icon: FileText,
    iconColor: "text-blue-500",
    href: "/dashboard/health-records",
  },
  {
    title: "Gửi thuốc",
    description: "Quản lý thuốc cho học sinh",
    content:
      "Phụ huynh có thể gửi thuốc cho trường, theo dõi việc sử dụng thuốc của con.",
    icon: Shield,
    iconColor: "text-red-500",
    href: "/dashboard/medications",
  },
  {
    title: "Nhận kết quả",
    description: "Xem kết quả khám sức khỏe",
    content:
      "Xem kết quả khám sức khỏe định kỳ và các chỉ số sức khỏe của học sinh.",
    icon: Calendar,
    iconColor: "text-green-500",
    href: "/dashboard/health-results",
  },
  {
    title: "Lịch sử bệnh án",
    description: "Thông tin và hướng dẫn",
    content:
      "Truy cập tài liệu về sức khỏe học đường, hướng dẫn phòng bệnh và các thông tin y tế quan trọng khác.",
    icon: BookOpen,
    iconColor: "text-purple-500",
    href: "/dashboard/resources",
  },
  {
    title: "Sự kiện y tế",
    description: "Kết nối phụ huynh và nhà trường",
    content:
      "Hệ thống liên lạc giữa phụ huynh và nhân viên y tế, đặt lịch tư vấn và thông báo kết quả kiểm tra.",
    icon: MessageSquare,
    iconColor: "text-yellow-500",
    href: "/dashboard/events",
  },
  {
    title: "Xem phản hồi",
    description: "Theo dõi và cấp phát thuốc",
    content:
      "Phụ huynh có thể gửi thuốc cho trường, nhân viên y tế quản lý và cấp phát thuốc theo chỉ định.",
    icon: Users,
    iconColor: "text-orange-500",
    href: "/dashboard/feedback",
  },
];

export default function Feature() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleFeatureClick = (
    e: React.MouseEvent,
    feature: (typeof features)[0]
  ) => {
    e.preventDefault();
    const auth = getAuthData();
    if (!auth) {
      setOpen(true);
    } else {
      router.push(feature.href);
    }
  };
  useEffect(() => {
    return () => {
      setOpen(false);
    };
  }, []);
  return (
    <>
      <section
        id="features"
        className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Tính năng chính
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hệ thống của chúng tôi cung cấp đầy đủ các công cụ cần thiết để
                quản lý sức khỏe học sinh hiệu quả
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={(e) => handleFeatureClick(e, feature)}
                className="cursor-pointer"
              >
                <Card className="h-full w-full">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                    <div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.content}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
      <LoginPopup open={open} setOpen={setOpen} router={router} />
    </>
  );
}

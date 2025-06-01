import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { cn } from "@/lib/utils";
import Link from "next/link";

const features = [
  {
    title: "Hồ sơ sức khỏe",
    description: "Quản lý thông tin sức khỏe học sinh",
    content:
      "Phụ huynh có thể khai báo dị ứng, bệnh mãn tính, tiền sử điều trị, thị lực, thính lực, tiêm chủng và các thông tin sức khỏe khác.",
    icon: FileText,
    iconColor: "text-blue-500",
    href: "/dashboard/health-records",
    color: "blue",
  },
  {
    title: "Gửi thuốc",
    description: "Quản lý thuốc cho học sinh",
    content:
      "Phụ huynh có thể gửi thuốc cho trường, theo dõi việc sử dụng thuốc của con.",
    icon: Shield,
    iconColor: "text-red-500",
    href: "/dashboard/medications",
    color: "red",
  },
  {
    title: "Nhận kết quả",
    description: "Xem kết quả khám sức khỏe",
    content:
      "Xem kết quả khám sức khỏe định kỳ và các chỉ số sức khỏe của học sinh.",
    icon: Calendar,
    iconColor: "text-green-500",
    href: "/dashboard/health-results",
    color: "green",
  },
  {
    title: "Lịch sử bệnh án",
    description: "Thông tin và hướng dẫn",
    content:
      "Truy cập tài liệu về sức khỏe học đường, hướng dẫn phòng bệnh và các thông tin y tế quan trọng khác.",
    icon: BookOpen,
    iconColor: "text-purple-500",
    href: "/dashboard/resources",
    color: "purple",
  },
  {
    title: "Sự kiện y tế",
    description: "Kết nối phụ huynh và nhà trường",
    content:
      "Hệ thống liên lạc giữa phụ huynh và nhân viên y tế, đặt lịch tư vấn và thông báo kết quả kiểm tra.",
    icon: MessageSquare,
    iconColor: "text-yellow-500",
    href: "/dashboard/events",
    color: "yellow",
  },
  {
    title: "Xem phản hồi",
    description: "Theo dõi và cấp phát thuốc",
    content:
      "Phụ huynh có thể gửi thuốc cho trường, nhân viên y tế quản lý và cấp phát thuốc theo chỉ định.",
    icon: Users,
    iconColor: "text-orange-500",
    href: "/dashboard/feedback",
    color: "orange",
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
                className="cursor-pointer select-none hover:scale-105 transition-all duration-300"
              >
                <Card
                  className={cn(
                    "h-full cursor-pointer border-2 transition-all duration-300 hover:shadow-lg flex flex-col",
                    {
                      "hover:border-blue-500": feature.color === "blue",
                      "hover:border-red-500": feature.color === "red",
                      "hover:border-green-500": feature.color === "green",
                      "hover:border-purple-500": feature.color === "purple",
                      "hover:border-yellow-500": feature.color === "yellow",
                      "hover:border-orange-500": feature.color === "orange",
                    }
                  )}
                >
                  <CardHeader className="flex flex-row items-center gap-4 h-24">
                    <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                    <div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.content}</p>
                  </CardContent>
                  <CardFooter className="pt-0 mt-auto">
                    <div className={cn("flex items-center font-medium transition-all duration-300 group", {
                      "text-blue-500": feature.color === "blue",
                      "text-red-500": feature.color === "red",
                      "text-green-500": feature.color === "green",
                      "text-purple-500": feature.color === "purple",
                      "text-yellow-500": feature.color === "yellow",
                      "text-orange-500": feature.color === "orange",
                    })}>
                      Xem chi tiết
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </CardFooter>
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

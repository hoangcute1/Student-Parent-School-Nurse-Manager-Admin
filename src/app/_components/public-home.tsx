"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  FileText,
  Heart,
  Info,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

const resources = [
  {
    title: "Hướng dẫn phòng bệnh mùa học",
    description: "Các biện pháp phòng ngừa bệnh tật trong năm học mới",
    icon: Shield,
    iconColor: "text-blue-500",
  },
  {
    title: "Dinh dưỡng học đường",
    description: "Chế độ dinh dưỡng cân đối cho học sinh các cấp",
    icon: Heart,
    iconColor: "text-blue-500",
  },
  {
    title: "Sức khỏe tâm lý học sinh",
    description:
      "Nhận biết và hỗ trợ vấn đề tâm lý ở trẻ em và thanh thiếu niên",
    icon: Info,
    iconColor: "text-blue-500",
  },
];

export function PublicHomePage() {
  return (
    <>
      <section className="flex justify-center items-center w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <p className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none ">
                  Hệ thống Quản lý Y tế Học đường
                </p>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Giải pháp toàn diện để quản lý sức khỏe học sinh, theo dõi sự
                  kiện y tế, và đảm bảo môi trường học tập an toàn.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="#features">
                  <Button size="lg">Tìm hiểu thêm</Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:mr-0">
              <Image
                src="/placeholder.svg?height=550&width=550"
                alt="Hệ thống Y tế Học đường"
                width={550}
                height={550}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

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
              <Link href={feature.href} key={index}>
                <Card className='h-full w-full'>
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="resources"
        className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 flex justify-center items-center"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Tài liệu sức khỏe
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Thông tin và tài liệu hữu ích về sức khỏe học đường
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {resources.map((resource, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <resource.icon className={`h-8 w-8 ${resource.iconColor}`} />
                  <div>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Tài liệu hướng dẫn chi tiết về chủ đề này.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Xem tài liệu
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

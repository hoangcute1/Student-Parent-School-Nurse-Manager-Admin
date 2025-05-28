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
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <CardTitle>Khai báo hồ sơ sức khỏe</CardTitle>
                  <CardDescription>
                    Quản lý thông tin sức khỏe học sinh
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>
                  Phụ huynh có thể khai báo dị ứng, bệnh mãn tính, tiền sử điều
                  trị, thị lực, thính lực, tiêm chủng và các thông tin sức khỏe
                  khác.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Shield className="h-8 w-8 text-red-500" />
                <div>
                  <CardTitle>Gửi thuốc</CardTitle>
                  <CardDescription>aaaaa</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>Phụ huynh có thể gửi thuốc cho học sinh abcdef.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Calendar className="h-8 w-8 text-green-500" />
                <div>
                  <CardTitle>Nhận kết quả</CardTitle>
                  <CardDescription>aaaa</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <BookOpen className="h-8 w-8 text-purple-500" />
                <div>
                  <CardTitle>Lịch sử bệnh án</CardTitle>
                  <CardDescription>Thông tin và hướng dẫn</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>
                  Truy cập tài liệu về sức khỏe học đường, hướng dẫn phòng bệnh
                  và các thông tin y tế quan trọng khác.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <MessageSquare className="h-8 w-8 text-yellow-500" />
                <div>
                  <CardTitle>Sự kiện y tế</CardTitle>
                  <CardDescription>
                    Kết nối phụ huynh và nhà trường
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>
                  Hệ thống liên lạc giữa phụ huynh và nhân viên y tế, đặt lịch
                  tư vấn và thông báo kết quả kiểm tra.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Users className="h-8 w-8 text-orange-500" />
                <div>
                  <CardTitle>Xem phản hồi</CardTitle>
                  <CardDescription>Theo dõi và cấp phát thuốc</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>
                  Phụ huynh có thể gửi thuốc cho trường, nhân viên y tế quản lý
                  và cấp phát thuốc theo chỉ định.
                </p>
              </CardContent>
            </Card>
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
            {[
              {
                title: "Hướng dẫn phòng bệnh mùa học",
                description:
                  "Các biện pháp phòng ngừa bệnh tật trong năm học mới",
                icon: Shield,
              },
              {
                title: "Dinh dưỡng học đường",
                description: "Chế độ dinh dưỡng cân đối cho học sinh các cấp",
                icon: Heart,
              },
              {
                title: "Sức khỏe tâm lý học sinh",
                description:
                  "Nhận biết và hỗ trợ vấn đề tâm lý ở trẻ em và thanh thiếu niên",
                icon: Info,
              },
            ].map((item, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <item.icon className="h-8 w-8 text-blue-500" />
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
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

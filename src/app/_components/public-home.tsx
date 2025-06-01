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
  Eye,
  Utensils,
  Brain,
  ArrowRight,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Bandage,
} from "lucide-react";
import { useRef, useEffect } from "react";
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
    iconColor: "text-blue-600",
    href: "/dashboard/health-records",
  },
  {
    title: "Gửi thuốc",
    description: "Quản lý thuốc cho học sinh",
    content:
      "Phụ huynh có thể gửi thuốc cho trường, theo dõi việc sử dụng thuốc của con.",
    icon: Shield,
    iconColor: "text-blue-600",
    href: "/dashboard/medications",
  },
  {
    title: "Nhận kết quả",
    description: "Xem kết quả khám sức khỏe",
    content:
      "Xem kết quả khám sức khỏe định kỳ và các chỉ số sức khỏe của học sinh.",
    icon: Calendar,
    iconColor: "text-blue-600",
    href: "/dashboard/health-results",
  },
  {
    title: "Lịch sử bệnh án",
    description: "Thông tin và hướng dẫn",
    content:
      "Truy cập tài liệu về sức khỏe học đường, hướng dẫn phòng bệnh và các thông tin y tế quan trọng khác.",
    icon: BookOpen,
    iconColor: "text-blue-600",
    href: "/dashboard/resources",
  },
  {
    title: "Sự kiện y tế",
    description: "Kết nối phụ huynh và nhà trường",
    content:
      "Hệ thống liên lạc giữa phụ huynh và nhân viên y tế, đặt lịch tư vấn và thông báo kết quả kiểm tra.",
    icon: MessageSquare,
    iconColor: "text-blue-600",
    href: "/dashboard/events",
  },
  {
    title: "Xem phản hồi",
    description: "Theo dõi và cấp phát thuốc",
    content:
      "Phụ huynh có thể gửi thuốc cho trường, nhân viên y tế quản lý và cấp phát thuốc theo chỉ định.",
    icon: Users,
    iconColor: "text-blue-600",
    href: "/dashboard/feedback",
  },
];

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
    description: "Nhận biết và hỗ trợ vấn đề tâm lý ở trẻ em và thanh thiếu niên",
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

const blogPosts = [
  {
    title: "Cách phát hiện sớm các vấn đề về thị lực ở học sinh",
    description: "Hướng dẫn cho phụ huynh và giáo viên về dấu hiệu nhận biết",
    image: "/blog/vision-care.jpg",
    date: "2023-12-01",
    author: "BS. Nguyễn Văn A",
    icon: Eye,
    iconColor: "text-blue-600",
    href: "/blog/vision-care",
  },
  {
    title: "Dinh dưỡng hợp lý cho học sinh trong mùa thi",
    description: "Chế độ ăn uống khoa học giúp tăng cường sức khỏe và trí não",
    image: "/blog/exam-nutrition.jpg",
    date: "2023-11-28",
    author: "ThS. Trần Thị B",
    icon: Utensils,
    iconColor: "text-blue-600",
    href: "/blog/exam-nutrition",
  },
  {
    title: "Giải pháp giảm stress cho học sinh",
    description: "Các phương pháp giúp học sinh cân bằng tinh thần",
    image: "/blog/stress-management.jpg",
    date: "2023-11-25",
    author: "ThS. Lê Văn C",
    icon: Brain,
    iconColor: "text-blue-600",
    href: "/blog/stress-management",
  },
  {
    title: "Sơ cứu cơ bản cho trẻ em - Kỹ năng cần thiết cho phụ huynh",
    description:
      "Hướng dẫn chi tiết về các kỹ thuật sơ cứu cơ bản dành cho trẻ em trong trường học và tại nhà",
    image: "/blog/first-aid.jpg",
    date: "2023-12-15",
    author: "BS. Hoàng Thị D",
    icon: Bandage,
    iconColor: "text-blue-600",
    href: "/blog/first-aid",
  },
];

export function PublicHomePage() {
  const resourcesScrollRef = useRef<HTMLDivElement>(null);
  const blogScrollRef = useRef<HTMLDivElement>(null);

 // Sửa lại khai báo kiểu cho hàm scrollContent
const scrollContent = (
  direction: "left" | "right",
  ref: React.RefObject<HTMLDivElement | null>  // Thêm null vào union type
) => {
  if (!ref.current) return; // Thêm guard clause để kiểm tra null
  
  const container = ref.current;
  const scrollAmount = 400;

  const newScrollLeft = container.scrollLeft + 
    (direction === "left" ? scrollAmount : -scrollAmount);

  container.scrollTo({
    left: newScrollLeft,
    behavior: "smooth",
  });
};

  return (
    <>
      <section className="flex justify-center items-center w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-100 to-white">
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
        className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center bg-white"
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="resources"
        className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 flex justify-center items-center"
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

          <div className="relative mt-8">
            <button
              onClick={() => scrollContent("right", resourcesScrollRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>

            <div
              ref={resourcesScrollRef}
              className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {resources.map((resource, index) => (
                <div key={index} className="min-w-[350px] snap-center">
                  <Link href={resource.href}>
                    <Card className="h-full hover:shadow-lg transition-shadow border-blue-100 hover:border-blue-200 flex flex-col">
                      <CardHeader className="flex flex-col space-y-4">
                        <div className="aspect-video relative rounded-lg overflow-hidden">
                          <Image
                            src={resource.image}
                            alt={resource.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{resource.date}</span>
                            <span>•</span>
                            <span>{resource.author}</span>
                          </div>
                          <CardTitle className="text-xl font-bold">
                            {resource.title}
                          </CardTitle>
                          <CardDescription>
                            {resource.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <div className="flex-1"></div>
                      <CardFooter className="mt-auto pt-6">
                        <Button
                          variant="ghost"
                          className="w-full hover:bg-blue-50 hover:text-blue-600 border-blue-200"
                        >
                          Xem tài liệu
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>

            <button
               onClick={() => scrollContent("left", resourcesScrollRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      <section
        id="blog"
        className="w-full py-12 md:py-24 lg:py-32 bg-white flex justify-center items-center"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Blog Chia Sẻ Kinh Nghiệm
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Kiến thức và kinh nghiệm từ các chuyên gia y tế học đường
              </p>
            </div>
          </div>

          <div className="relative mt-8">
            <button
              onClick={() => scrollContent("right", blogScrollRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>

            <div
              ref={blogScrollRef}
              className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {blogPosts.map((post, index) => (
                <div key={index} className="min-w-[350px] snap-center">
                  <Link href={post.href}>
                    <Card className="h-full hover:shadow-lg transition-shadow border-blue-100 hover:border-blue-200 flex flex-col">
                      <CardHeader className="flex flex-col space-y-4">
                        <div className="aspect-video relative rounded-lg overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.author}</span>
                          </div>
                          <CardTitle className="text-xl font-bold">
                            {post.title}
                          </CardTitle>
                          <CardDescription>
                            {post.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <div className="flex-1"></div>
                      <CardFooter className="mt-auto pt-6">
                        <Button
                          variant="ghost"
                          className="w-full hover:bg-blue-50 hover:text-blue-600 border-blue-200"
                        >
                          Đọc thêm
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollContent("left", blogScrollRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
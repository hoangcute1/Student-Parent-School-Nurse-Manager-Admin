"use client";

import { Heart, Info, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Banner from "./banner";
import Feature from "./feature";
import { useRouter } from "next/router";

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
      <Banner />
      <Feature />
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

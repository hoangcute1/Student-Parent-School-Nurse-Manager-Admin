import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resources } from "../_constants/resource";
import scrollContent from "./scrollContent";
import { useRef } from "react";
import { ArrowRight, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Resource() {
  const resourcesScrollRef = useRef<HTMLDivElement>(null);
  return (
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
  );
}

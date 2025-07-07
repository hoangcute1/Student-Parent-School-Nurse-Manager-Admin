import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { blogPosts } from "../_constants/blog";
import { ArrowRight, CalendarIcon } from "lucide-react";
import Link from "next/link";

export default function Blog() {
  // Duplicate blog posts for infinite scroll effect
  const duplicatedPosts = [...blogPosts, ...blogPosts];

  return (
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

        <div className="mt-8 blog-scroll-wrapper">
          <div className="blog-infinite-scroll">
            {duplicatedPosts.map((post, index) => (
              <div key={`${post.href}-${index}`} className="blog-card-slide">
                <Link href={post.href}>
                  <Card className="h-full blog-card-hover border-blue-100 hover:border-blue-200 flex flex-col overflow-hidden">
                    <CardHeader className="flex flex-col space-y-4 p-4">
                      <div className="aspect-video relative rounded-lg overflow-hidden blog-image-hover">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{post.date}</span>
                          <span>•</span>
                          <span className="text-xs">{post.author}</span>
                        </div>
                        <CardTitle className="text-lg md:text-xl font-bold line-clamp-2 leading-tight">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3 text-sm">
                          {post.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <div className="flex-1"></div>
                    <CardFooter className="mt-auto pt-4 p-4">
                      <Button
                        variant="ghost"
                        className="w-full hover:bg-blue-50 hover:text-blue-600 border-blue-200 transition-all duration-300 group text-sm"
                      >
                        Đọc thêm
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

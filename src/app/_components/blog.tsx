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
import {
  ArrowRight,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef, useEffect } from "react";
import Link from "next/link";
import scrollContent from "./scrollContent";

export default function Blog() {
  const blogScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = blogScrollRef.current;
    let scrollInterval: NodeJS.Timeout;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
          const newScrollPosition = scrollContainer.scrollLeft + 350; // One card width

          if (scrollContainer.scrollLeft >= maxScroll) {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollContainer.scrollTo({
              left: newScrollPosition,
              behavior: 'smooth'
            });
          }
        }
      }, 5000); // Scroll every 5 seconds
    };

    const stopAutoScroll = () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };

    // Start auto-scrolling
    startAutoScroll();

    // Pause on hover/touch
    scrollContainer?.addEventListener('mouseenter', stopAutoScroll);
    scrollContainer?.addEventListener('touchstart', stopAutoScroll);
    scrollContainer?.addEventListener('mouseleave', startAutoScroll);
    scrollContainer?.addEventListener('touchend', startAutoScroll);

    // Cleanup
    return () => {
      stopAutoScroll();
      scrollContainer?.removeEventListener('mouseenter', stopAutoScroll);
      scrollContainer?.removeEventListener('touchstart', stopAutoScroll);
      scrollContainer?.removeEventListener('mouseleave', startAutoScroll);
      scrollContainer?.removeEventListener('touchend', startAutoScroll);
    };
  }, []);

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
                          <span>{post.author.replace('https://', '').split('/')[0]}</span>
                        </div>
                        <CardTitle className="text-xl font-bold">
                          {post.title}
                        </CardTitle>
                        <CardDescription>{post.description}</CardDescription>
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
  );
}

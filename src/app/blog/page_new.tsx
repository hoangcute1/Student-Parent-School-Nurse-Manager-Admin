"use client";

import { blogPosts } from "@/app/_constants/blog";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User, ArrowRight, BookOpen } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-6 py-2 mb-6">
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">Kiến thức sức khỏe</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Blog Chia Sẻ
              <span className="block text-blue-200">Kinh Nghiệm</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Khám phá các bài viết hữu ích về sức khỏe, dinh dưỡng và an toàn
              cho học sinh từ đội ngũ chuyên gia hàng đầu
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {blogPosts.map((post, index) => (
            <Link key={index} href={post.href} className="group">
              <Card className="h-full bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 overflow-hidden border-0 shadow-xl">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Icon Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg">
                      <post.icon className={`h-6 w-6 ${post.iconColor}`} />
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-6 right-6">
                    <div className="px-4 py-2 rounded-full bg-blue-600/90 backdrop-blur-sm text-white text-sm font-medium">
                      Sức khỏe
                    </div>
                  </div>
                </div>

                <CardContent className="p-8">
                  <h2 className="font-bold text-2xl mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed text-base">
                    {post.description}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(post.date).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                      <span>Đọc thêm</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-sm text-gray-400">5 phút đọc</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="container mx-auto px-4 mt-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Có thắc mắc về sức khỏe học sinh?
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Liên hệ với đội ngũ chuyên gia của chúng tôi để được tư vấn và hỗ
              trợ tận tình
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Liên hệ ngay
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { blogPosts } from "@/app/_constants/blog";
import { blogContent } from "@/app/_constants/blog-content";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  User,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  ArrowLeft,
  Calendar,
  Eye,
} from "lucide-react";

type BlogSlug = string;

type Params = {
  params: Promise<{ slug: BlogSlug }>;
};

export default function BlogDetailPage({ params }: Params) {
  const { slug } = React.use(params);
  const post = blogPosts.find((post) => post.href === `/blog/${slug}`);
  const content = blogContent[slug as keyof typeof blogContent];

  if (!post || !content) {
    notFound();
  }

  // Get related posts (excluding current post)
  const relatedPosts = blogPosts
    .filter((p) => p.href !== post.href)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="container mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 animate-fade-in">
            <Link href="/" className="hover:text-blue-600 transition-colors duration-300">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/blog" className="hover:text-blue-600 transition-colors duration-300">
              Tài liệu
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{post.title}</span>
          </div>

          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-300 mb-6 hover:translate-x-1 animate-slide-in-left"
            style={{ animationDelay: '200ms' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in-up">
              {/* Article Header */}
              <div className="p-6 pb-4 animate-fade-in">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight animate-slide-in-left">
                  {post.title}
                </h1>

                {/* Author Info & Meta */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>1.2k lượt xem</span>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative overflow-hidden animate-fade-in" style={{ animationDelay: '400ms' }}>
                <Image
                  src={post.image}
                  alt={post.title}
                  width={800}
                  height={600}
                  className="w-full h-auto hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>

              {/* Article Content */}
              <div className="p-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
                <div className="prose prose-lg max-w-none blog-content-enhanced">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg animate-slide-in-right" style={{ animationDelay: '800ms' }}>
                    <p className="text-gray-700 italic font-medium">
                      {post.description}
                    </p>
                  </div>

                  <div dangerouslySetInnerHTML={{ __html: content.content }} />
                </div>

                {/* Share Section */}
                <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 animate-slide-in-left" style={{ animationDelay: '1200ms' }}>
                      Chia sẻ bài viết
                    </h3>
                    <div className="flex gap-3 animate-bounce-in" style={{ animationDelay: '1400ms' }}>
                      <button
                        onClick={() => {
                          const url = encodeURIComponent(window.location.href);
                          const text = encodeURIComponent(post.title);
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
                            "_blank",
                            "width=600,height=400"
                          );
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
                      >
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </button>
                      <button
                        onClick={() => {
                          const url = encodeURIComponent(window.location.href);
                          const text = encodeURIComponent(
                            `${post.title} - ${post.description}`
                          );
                          window.open(
                            `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
                            "_blank",
                            "width=600,height=400"
                          );
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
                      >
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </button>
                      <button
                        onClick={() => {
                          const url = encodeURIComponent(window.location.href);
                          const text = encodeURIComponent(
                            `${post.title}\n\n${post.description}\n\nĐọc thêm tại: ${window.location.href}`
                          );
                          window.open(`https://wa.me/?text=${text}`, "_blank");
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky-sidebar animate-fade-in-right">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 animate-slide-in-right" style={{ animationDelay: '200ms' }}>
                <div className="w-1 h-6 bg-blue-600 rounded animate-pulse-slow"></div>
                Bài viết liên quan
              </h3>

              <div className="space-y-4">
                {relatedPosts.map((relatedPost, index) => (
                  <Link
                    key={relatedPost.href}
                    href={relatedPost.href}
                    className="block group sidebar-item animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:scale-[1.02] transform">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-50 group-hover:shadow-lg transition-all duration-300">
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-all duration-300">
                          {relatedPost.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                          <Calendar className="h-3 w-3" />
                          <span>{relatedPost.date}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

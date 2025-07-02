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
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/blog" className="hover:text-blue-600">
              Tài liệu
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{post.title}</span>
          </div>

          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
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
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Article Header */}
              <div className="p-6 pb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {post.title}
                </h1>

                {/* Author Info & Meta */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-6">
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
              <div className="relative h-64 md:h-80 lg:h-96">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Social Share Buttons */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <button className="bg-white rounded-lg p-2 shadow-md hover:shadow-lg transition-shadow group social-btn">
                    <Share2 className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                  </button>
                  <button className="bg-white rounded-lg p-2 shadow-md hover:shadow-lg transition-shadow group social-btn">
                    <Facebook className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                  </button>
                  <button className="bg-white rounded-lg p-2 shadow-md hover:shadow-lg transition-shadow group social-btn">
                    <Twitter className="h-4 w-4 text-blue-400 group-hover:text-blue-500" />
                  </button>
                  <button className="bg-white rounded-lg p-2 shadow-md hover:shadow-lg transition-shadow group social-btn">
                    <MessageCircle className="h-4 w-4 text-green-600 group-hover:text-green-700" />
                  </button>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                <div className="prose prose-lg max-w-none blog-content-enhanced">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                    <p className="text-gray-700 italic font-medium">
                      {post.description}
                    </p>
                  </div>

                  <div dangerouslySetInnerHTML={{ __html: content.content }} />
                </div>

                {/* Share Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Chia sẻ bài viết
                    </h3>
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
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
            <div className="bg-white rounded-lg shadow-sm p-6 sticky-sidebar">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                Bài viết liên quan
              </h3>

              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.href}
                    href={relatedPost.href}
                    className="block group sidebar-item"
                  >
                    <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {relatedPost.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
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

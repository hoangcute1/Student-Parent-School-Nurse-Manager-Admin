"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { blogPosts } from "@/app/_constants/blog";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BlogSlug = string;

type Params = {
  params: Promise<{ slug: BlogSlug }>;
};

export default function BlogDetailPage({ params }: Params) {
  const { slug } = React.use(params);
  const post = blogPosts.find(post => post.href === `/blog/${slug}`);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>
        <ChevronRight className="h-4 w-4" />
        <span>{post.title}</span>
      </div>

      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
        
        <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="prose max-w-none">
          {/* Blog content goes here */}
          <p className="text-lg text-gray-600">{post.description}</p>
          {/* Add more content sections as needed */}
        </div>
      </article>
    </div>
  );
}

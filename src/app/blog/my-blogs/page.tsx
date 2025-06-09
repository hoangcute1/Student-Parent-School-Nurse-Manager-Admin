"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function MyBlogsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bài viết của tôi</h1>
        <Link href="/blog/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tạo bài viết mới
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Blog post card with management options */}
        <Card className="p-4">
          <div className="flex gap-4">
            <div className="relative w-40 h-40">
              <Image
                src="/blog/example.jpg"
                alt="Blog thumbnail"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">Tiêu đề bài viết</h2>
                  <p className="text-gray-600">Mô tả ngắn về bài viết...</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex gap-4 text-sm text-gray-500">
                <span>Trạng thái: Chờ duyệt</span>
                <span>Đăng ngày: 20/12/2023</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

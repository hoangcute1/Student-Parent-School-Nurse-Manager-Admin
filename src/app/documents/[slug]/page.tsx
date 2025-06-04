"use client";

import { notFound } from "next/navigation";
import Header from "@/components/layout/header/header";
import { Footer } from "@/components/layout/footer/footer";
import { Facebook, Twitter, Share2, Clock, User, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const documents = {
  "prevention-guide": {
    title: "Hướng dẫn phòng bệnh mùa học",
    description: "Các biện pháp phòng ngừa bệnh tật trong năm học mới",
    image: "/IMG-0201.webp",
    date: "2023-12-05",
    author: "BS. Nguyễn Thị D",
    content: `
      <div class="lead-paragraph mb-6 text-lg text-gray-700">
        Để đảm bảo sức khỏe cho học sinh trong mùa học mới, phụ huynh và nhà trường cần chú ý một số biện pháp phòng ngừa quan trọng sau.
      </div>

      <h2 class="text-2xl font-bold mb-4">1. Vệ sinh cá nhân</h2>
      <p class="mb-4">Rửa tay thường xuyên bằng xà phòng, đặc biệt là trước khi ăn và sau khi đi vệ sinh. Giữ móng tay sạch sẽ và cắt gọn gàng.</p>

      <h2 class="text-2xl font-bold mb-4">2. Môi trường học tập</h2>
      <p class="mb-4">Đảm bảo phòng học thông thoáng, ánh sáng đầy đủ. Vệ sinh bàn ghế, đồ dùng học tập thường xuyên.</p>

      <div class="bg-blue-50 p-6 rounded-lg my-6">
        <h3 class="text-xl font-bold mb-3">Lưu ý quan trọng:</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>Đeo khẩu trang khi có triệu chứng ho, sốt</li>
          <li>Không dùng chung đồ dùng cá nhân</li>
          <li>Thông báo ngay cho giáo viên khi có biểu hiện bệnh</li>
        </ul>
      </div>

      <h2 class="text-2xl font-bold mb-4">3. Chế độ dinh dưỡng</h2>
      <p class="mb-4">Ăn uống đầy đủ các nhóm chất, tăng cường rau xanh và trái cây. Uống đủ nước mỗi ngày.</p>
    `,
    relatedDocs: [
      {
        title: "Dinh dưỡng học đường",
        href: "/documents/school-nutrition",
        image: "/bia-copy-2-9193.png"
      },
      {
        title: "Sức khỏe tâm lý học sinh",
        href: "/documents/mental-health",
        image: "/resources/mental-health.jpg"
      }
    ]
  },
  "school-nutrition": {
    title: "Dinh dưỡng học đường",
    description: "Chế độ dinh dưỡng cân đối giúp học sinh phát triển toàn diện",
    image: "/bia-copy-2-9193.png",
    date: "2023-12-01",
    author: "BS. Trần Văn A",
    content: `
      <p>Chế độ dinh dưỡng cân đối giúp học sinh phát triển toàn diện:</p>
      <ul>
        <li>Bổ sung đầy đủ các nhóm chất: đạm, tinh bột, chất béo, vitamin và khoáng chất.</li>
        <li>Hạn chế đồ ăn nhanh và nước ngọt có ga.</li>
        <li>Khuyến khích uống đủ nước mỗi ngày.</li>
      </ul>
    `,
    relatedDocs: [
      {
        title: "Hướng dẫn phòng bệnh mùa học",
        href: "/documents/prevention-guide",
        image: "/resources/prevention-guide.jpg"
      },
      {
        title: "Sức khỏe tâm lý học sinh",
        href: "/documents/mental-health",
        image: "/resources/mental-health.jpg"
      }
    ]
  },
  "mental-health": {
    title: "Sức khỏe tâm lý học sinh",
    description: "Sức khỏe tâm lý là yếu tố quan trọng trong sự phát triển của trẻ",
    image: "/resources/mental-health.jpg",
    date: "2023-12-03",
    author: "BS. Lê Thị B",
    content: `
      <p>Sức khỏe tâm lý là yếu tố quan trọng trong sự phát triển của trẻ:</p>
      <ul>
        <li>Quan tâm đến cảm xúc và hành vi của trẻ.</li>
        <li>Khuyến khích trẻ chia sẻ những khó khăn gặp phải.</li>
        <li>Tham khảo ý kiến chuyên gia khi cần thiết.</li>
      </ul>
    `,
    relatedDocs: [
      {
        title: "Hướng dẫn phòng bệnh mùa học",
        href: "/documents/prevention-guide",
        image: "/resources/prevention-guide.jpg"
      },
      {
        title: "Dinh dưỡng học đường",
        href: "/documents/school-nutrition",
        image: "/resources/nutrition-guide.jpg"
      }
    ]
  },
  "electrical-safety": {
    title: "8 Nguyên tắc phòng tránh điện giật cho trẻ em khi vui chơi nghỉ hè",
    description: "Hướng dẫn chi tiết cho phụ huynh và giáo viên về cách bảo vệ trẻ khỏi tai nạn điện giật",
    image: "/resources/electrical-safety.jpg",
    date: "2023-12-10",
    author: "ThS. Nguyễn Văn X",
    content: `
      <div class="lead-paragraph mb-6 text-lg text-gray-700">
        Trong thời gian nghỉ hè, trẻ em thường có nhiều thời gian vui chơi và có thể gặp các nguy cơ về điện giật. Dưới đây là 8 nguyên tắc quan trọng để phòng tránh tai nạn điện giật cho trẻ.
      </div>

      <h2 class="text-2xl font-bold mb-4">1. Giáo dục trẻ về nguy hiểm của điện</h2>
      <p class="mb-4">Cần giải thích cho trẻ hiểu về sự nguy hiểm của điện và tại sao không được chơi đùa với các thiết bị điện. Dạy trẻ nhận biết các biển cảnh báo nguy hiểm về điện.</p>

      <h2 class="text-2xl font-bold mb-4">2. Kiểm tra an toàn điện trong nhà</h2>
      <p class="mb-4">Thường xuyên kiểm tra các ổ cắm, dây điện, đảm bảo không có dây điện bị hở, ổ cắm bị lỏng. Lắp đặt nắp che ổ điện để bảo vệ trẻ nhỏ.</p>

      <div class="bg-blue-50 p-6 rounded-lg my-6">
        <h3 class="text-xl font-bold mb-3">Các biện pháp phòng ngừa cụ thể:</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>Không để dây điện, ổ cắm tiếp xúc với nước</li>
          <li>Dạy trẻ không chạm vào ổ điện khi tay ướt</li>
          <li>Không để thiết bị điện gần khu vực trẻ chơi đùa</li>
          <li>Lắp đặt cầu dao chống giật</li>
        </ul>
      </div>

      <h2 class="text-2xl font-bold mb-4">3. Khu vực vui chơi an toàn</h2>
      <p class="mb-4">Xác định và giới hạn khu vực vui chơi an toàn cho trẻ, tránh xa các thiết bị điện và đường dây điện.</p>

      <h2 class="text-2xl font-bold mb-4">4. Hướng dẫn sử dụng thiết bị điện</h2>
      <p class="mb-4">Dạy trẻ cách sử dụng các thiết bị điện một cách an toàn và luôn có sự giám sát của người lớn.</p>

      <h2 class="text-2xl font-bold mb-4">5. Quy tắc ứng phó khẩn cấp</h2>
      <p class="mb-4">Hướng dẫn trẻ các bước cần làm khi phát hiện tình huống nguy hiểm về điện và cách gọi người lớn giúp đỡ.</p>

      <div class="bg-yellow-50 p-6 rounded-lg my-6">
        <h3 class="text-xl font-bold mb-3 text-yellow-800">Lưu ý quan trọng:</h3>
        <p class="text-yellow-800">Trong trường hợp xảy ra tai nạn điện giật, cần:</p>
        <ul class="list-disc pl-6 space-y-2 text-yellow-800">
          <li>Ngắt nguồn điện ngay lập tức</li>
          <li>Gọi cấp cứu</li>
          <li>Không chạm vào nạn nhân khi chưa ngắt điện</li>
        </ul>
      </div>
    `,
    relatedDocs: [
      {
        title: "Hướng dẫn phòng bệnh mùa học",
        href: "/documents/prevention-guide",
        image: "/resources/prevention-guide.jpg"
      },
      {
        title: "Sức khỏe tâm lý học sinh",
        href: "/documents/mental-health",
        image: "/resources/mental-health.jpg"
      }
    ]
  }
};

type DocumentSlug = keyof typeof documents;

type Params = {
  params: { slug: DocumentSlug }
};

export default function DocumentPage({ params }: Params) {
  const document = documents[params.slug];

  if (!document) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/#resources" className="hover:text-blue-600">Tài liệu</Link>
            <ChevronRight className="h-4 w-4" />
            <span>{document.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main content */}
            <div className="lg:col-span-8">
              <article className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-3xl font-bold mb-6">{document.title}</h1>
                
                {/* Meta information */}
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{document.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{document.date}</span>
                  </div>
                </div>

                {/* Featured image */}
                <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
                  <Image
                    src={document.image}
                    alt={document.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-6">
                  {document.description}
                </p>

                {/* Social sharing */}
                <div className="flex items-center gap-4 mb-8">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Facebook className="h-4 w-4" />
                    Chia sẻ
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Twitter className="h-4 w-4" />
                    Tweet
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Chia sẻ
                  </Button>
                </div>

                {/* Main content */}
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: document.content }}
                />
              </article>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24">
                <Card>
                  <CardHeader>
                    <CardTitle>Bài viết liên quan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {document.relatedDocs?.map((doc, index) => (
                      <Link href={doc.href} key={index} className="block group">
                        <div className="flex gap-4">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                            <Image
                              src={doc.image}
                              alt={doc.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium group-hover:text-blue-600 transition-colors">
                              {doc.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

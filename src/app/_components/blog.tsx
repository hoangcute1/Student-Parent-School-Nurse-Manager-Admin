import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function Blog() {
  return (
    <section id="blog" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Blog chia sẻ kinh nghiệm
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Bài viết và chia sẻ từ chuyên gia y tế và giáo dục
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {[
            {
              title: "Kinh nghiệm xử lý sự cố y tế tại trường học",
              date: "15/05/2025",
              author: "BS. Nguyễn Văn A",
            },
            {
              title: "Làm thế nào để trẻ hợp tác khi kiểm tra sức khỏe",
              date: "10/05/2025",
              author: "ThS. Trần Thị B",
            },
            {
              title: "Phòng ngừa dịch bệnh trong môi trường học đường",
              date: "05/05/2025",
              author: "PGS.TS Lê Văn C",
            },
          ].map((post, index) => (
            <Card key={index}>
              <CardHeader>
                <Image
                  src={`/placeholder.svg?height=200&width=400&text=Blog+${
                    index + 1
                  }`}
                  alt={post.title}
                  width={400}
                  height={200}
                  className="rounded-lg object-cover w-full"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
                <p className="mt-4 text-gray-600">
                  Tóm tắt bài viết chia sẻ kinh nghiệm và các thông tin hữu ích
                  về chủ đề sức khỏe học đường...
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Đọc tiếp
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

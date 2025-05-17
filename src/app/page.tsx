import Link from "next/link"
import Image from "next/image"
import { BookOpen, Calendar, FileText, Heart, Info, MessageSquare, Shield, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <header className="sticky flex justify-center items-center top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 pl-4">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold">Y Tế Học Đường</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Trang chủ
            </Link>
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Tính năng
            </Link>
            <Link href="#resources" className="text-sm font-medium transition-colors hover:text-primary">
              Tài liệu
            </Link>
            <Link href="#blog" className="text-sm font-medium transition-colors hover:text-primary">
              Blog
            </Link>
            <Link href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
              Liên hệ
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline">Đăng nhập</Button>
            </Link>
            <Link href="/register">
              <Button>Đăng ký ngay</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full">
        <section className="flex justify-center items-center w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <p className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none ">
                    Hệ thống Quản lý Y tế Học đường
                  </p>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Giải pháp toàn diện để quản lý sức khỏe học sinh, theo dõi sự kiện y tế, và đảm bảo môi trường học
                    tập an toàn.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="#features">
                    <Button size="lg">Tìm hiểu thêm</Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mr-0">
                <Image
                  src="/placeholder.svg?height=550&width=550"
                  alt="Hệ thống Y tế Học đường"
                  width={550}
                  height={550}
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tính năng chính</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hệ thống của chúng tôi cung cấp đầy đủ các công cụ cần thiết để quản lý sức khỏe học sinh hiệu quả
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <CardTitle>Hồ sơ sức khỏe</CardTitle>
                    <CardDescription>Quản lý thông tin sức khỏe học sinh</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    Phụ huynh có thể khai báo dị ứng, bệnh mãn tính, tiền sử điều trị, thị lực, thính lực, tiêm chủng và
                    các thông tin sức khỏe khác.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Shield className="h-8 w-8 text-red-500" />
                  <div>
                    <CardTitle>Xử lý sự kiện y tế</CardTitle>
                    <CardDescription>Ghi nhận và quản lý sự cố</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    Nhân viên y tế có thể ghi nhận và xử lý các sự kiện như tai nạn, sốt, té ngã, dịch bệnh và các tình
                    huống y tế khác.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Calendar className="h-8 w-8 text-green-500" />
                  <div>
                    <CardTitle>Tiêm chủng & Kiểm tra</CardTitle>
                    <CardDescription>Quản lý quy trình y tế</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    Quản lý toàn bộ quy trình tiêm chủng và kiểm tra y tế định kỳ từ thông báo đến theo dõi kết quả.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <BookOpen className="h-8 w-8 text-purple-500" />
                  <div>
                    <CardTitle>Tài liệu sức khỏe</CardTitle>
                    <CardDescription>Thông tin và hướng dẫn</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    Truy cập tài liệu về sức khỏe học đường, hướng dẫn phòng bệnh và các thông tin y tế quan trọng khác.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <MessageSquare className="h-8 w-8 text-yellow-500" />
                  <div>
                    <CardTitle>Tư vấn & Liên lạc</CardTitle>
                    <CardDescription>Kết nối phụ huynh và nhà trường</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    Hệ thống liên lạc giữa phụ huynh và nhân viên y tế, đặt lịch tư vấn và thông báo kết quả kiểm tra.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Users className="h-8 w-8 text-orange-500" />
                  <div>
                    <CardTitle>Quản lý thuốc</CardTitle>
                    <CardDescription>Theo dõi và cấp phát thuốc</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>Phụ huynh có thể gửi thuốc cho trường, nhân viên y tế quản lý và cấp phát thuốc theo chỉ định.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="resources" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tài liệu sức khỏe</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Thông tin và tài liệu hữu ích về sức khỏe học đường
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {[
                {
                  title: "Hướng dẫn phòng bệnh mùa học",
                  description: "Các biện pháp phòng ngừa bệnh tật trong năm học mới",
                  icon: Shield,
                },
                {
                  title: "Dinh dưỡng học đường",
                  description: "Chế độ dinh dưỡng cân đối cho học sinh các cấp",
                  icon: Heart,
                },
                {
                  title: "Sức khỏe tâm lý học sinh",
                  description: "Nhận biết và hỗ trợ vấn đề tâm lý ở trẻ em và thanh thiếu niên",
                  icon: Info,
                },
              ].map((item, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <item.icon className="h-8 w-8 text-blue-500" />
                    <div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Tài liệu hướng dẫn chi tiết về chủ đề này.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Xem tài liệu
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="blog" className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center">
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
                      src={`/placeholder.svg?height=200&width=400&text=Blog+${index + 1}`}
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
                      Tóm tắt bài viết chia sẻ kinh nghiệm và các thông tin hữu ích về chủ đề sức khỏe học đường...
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

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Liên hệ với chúng tôi</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Có thắc mắc hoặc cần hỗ trợ? Hãy liên hệ với chúng tôi
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin liên hệ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-blue-500"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>0123 456 789</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-blue-500"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span>info@ytehocduong.edu.vn</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-blue-500"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>123 Đường Giáo Dục, Quận Học Đường, TP. Hồ Chí Minh</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Gửi tin nhắn</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Họ tên
                        </label>
                        <input
                          id="name"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label
                        htmlFor="subject"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Tiêu đề
                      </label>
                      <input
                        id="subject"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tiêu đề tin nhắn"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Nội dung
                      </label>
                      <textarea
                        id="message"
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Nhập nội dung tin nhắn của bạn"
                      />
                    </div>
                    <Button type="submit">Gửi tin nhắn</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Y Tế Học Đường. Đã đăng ký bản quyền.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Điều khoản
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Chính sách
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Trợ giúp
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

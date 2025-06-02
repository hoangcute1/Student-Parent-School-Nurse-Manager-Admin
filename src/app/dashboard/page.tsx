import Link from "next/link"
import {
  Calendar,
  MessageSquare,
  Pill,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  BookOpen,
  Activity,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/layout/sidebar/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">Xin chào, Nguyễn Thị Hương</h1>
        <p className="text-blue-600">Xem thông tin sức khỏe của con em bạn tại trường</p>
      </div>

      {/* Thông tin học sinh */}
      <Card className="border-blue-100 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Activity className="mr-2 h-5 w-5 text-blue-600" />
            Thông tin học sinh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-blue-200">
                <AvatarFallback className="text-lg bg-blue-100 text-blue-700">NA</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-blue-800">Nguyễn Văn An</h3>
                <p className="text-blue-600">Lớp 1A • Mã học sinh: HS2025001</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="rounded-lg border bg-card p-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-blue-600">Chiều cao</h4>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Cập nhật 10/05/2025
                  </Badge>
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-blue-800">115</span>
                  <span className="text-sm text-blue-600 ml-1">cm</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-600">Bình thường</span>
                    <span className="text-blue-600">Cao hơn 2cm so với lần trước</span>
                  </div>
                  <Progress value={60} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
                </div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-blue-600">Cân nặng</h4>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Cập nhật 10/05/2025
                  </Badge>
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-blue-800">22</span>
                  <span className="text-sm text-blue-600 ml-1">kg</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-600">Bình thường</span>
                    <span className="text-blue-600">Tăng 1kg so với lần trước</span>
                  </div>
                  <Progress value={55} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
                </div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-blue-600">Thị lực</h4>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Cập nhật 10/05/2025
                  </Badge>
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-blue-800">10/10</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-600">Bình thường</span>
                    <span className="text-blue-600">Không thay đổi</span>
                  </div>
                  <Progress value={100} className="h-2 bg-blue-100" indicatorClassName="bg-green-500" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/dashboard/health-records" className="w-full">
            <Button variant="outline" className="w-full group border-blue-200 text-blue-700 hover:bg-blue-100">
              Xem hồ sơ sức khỏe đầy đủ
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Thông báo quan trọng */}
      <Card className="border-red-100">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-red-800">
            <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
            Thông báo quan trọng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-red-100 bg-red-50">
              <div className="rounded-full bg-red-100 p-2">
                <Calendar className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium">Tiêm chủng vắc-xin phòng cúm</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Nhà trường sẽ tổ chức tiêm chủng vắc-xin phòng cúm vào ngày 25/05/2025. Vui lòng xác nhận đồng ý cho
                  con tham gia trước ngày 20/05/2025.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Xác nhận đồng ý
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
                    Từ chối
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="rounded-full bg-amber-100 p-2">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium">Kiểm tra sức khỏe định kỳ - Học kỳ 1</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Kiểm tra sức khỏe định kỳ cho học sinh khối 1 sẽ diễn ra vào ngày 20/05/2025. Vui lòng chuẩn bị sổ
                  khám sức khỏe cho con em.
                </p>
                <div className="mt-2">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">
                    <Clock className="mr-1 h-3 w-3" />
                    Còn 5 ngày nữa
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs thông tin */}
      <Tabs defaultValue="medications" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-blue-50">
          <TabsTrigger value="medications" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Thuốc
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Sự kiện
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Tin nhắn
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Tài liệu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-800">Quản lý thuốc</h2>
            <Link href="/dashboard/medications/request">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Pill className="mr-2 h-4 w-4" />
                Gửi thuốc mới
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                name: "Paracetamol",
                dosage: "500mg, 1 viên",
                schedule: "Sau bữa trưa",
                startDate: "15/05/2025",
                endDate: "20/05/2025",
                status: "Đang sử dụng",
              },
              {
                name: "Vitamin C",
                dosage: "250mg, 1 viên",
                schedule: "Sau bữa sáng",
                startDate: "01/05/2025",
                endDate: "31/05/2025",
                status: "Đang sử dụng",
              },
              {
                name: "Cetirizine",
                dosage: "5mg, 1/2 viên",
                schedule: "Trước khi đi ngủ",
                startDate: "05/05/2025",
                endDate: "12/05/2025",
                status: "Đã hoàn thành",
              },
            ].map((medication, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  medication.status === "Đang sử dụng"
                    ? "border-blue-100 hover:border-blue-300"
                    : "hover:border-gray-300"
                } transition-all duration-200 cursor-pointer`}
              >
                <div
                  className={`rounded-full p-2 ${medication.status === "Đang sử dụng" ? "bg-blue-100" : "bg-gray-100"}`}
                >
                  <Pill
                    className={`h-4 w-4 ${medication.status === "Đang sử dụng" ? "text-blue-600" : "text-gray-600"}`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-blue-800">{medication.name}</h4>
                    <Badge
                      variant="outline"
                      className={
                        medication.status === "Đang sử dụng" ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"
                      }
                    >
                      {medication.status === "Đang sử dụng" ? (
                        <Clock className="mr-1 h-3 w-3" />
                      ) : (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      )}
                      {medication.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    {medication.dosage} • {medication.schedule}
                  </p>
                  <div className="flex justify-between mt-2 text-xs text-blue-500">
                    <span>Bắt đầu: {medication.startDate}</span>
                    <span>Kết thúc: {medication.endDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/dashboard/medications" className="block">
            <Button variant="outline" className="w-full group border-blue-200 text-blue-700 hover:bg-blue-100">
              Xem tất cả thuốc
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </TabsContent>

        <TabsContent value="events" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-800">Sự kiện y tế sắp tới</h2>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Kiểm tra sức khỏe định kỳ - Học kỳ 1",
                date: "20/05/2025",
                time: "08:00 - 11:30",
                description: "Kiểm tra sức khỏe tổng quát cho học sinh khối 1, 5, 9",
                location: "Phòng y tế trường học",
              },
              {
                title: "Tiêm chủng vắc-xin phòng cúm",
                date: "25/05/2025",
                time: "09:00 - 11:00",
                description: "Tiêm chủng cho học sinh đã đăng ký và được phụ huynh đồng ý",
                location: "Phòng y tế trường học",
              },
              {
                title: "Tư vấn dinh dưỡng học đường",
                date: "01/06/2025",
                time: "14:00 - 16:00",
                description: "Chương trình tư vấn dinh dưỡng cho phụ huynh và học sinh",
                location: "Hội trường trường học",
              },
            ].map((event, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-lg border border-blue-100 p-4 hover:border-blue-300 transition-all duration-200 cursor-pointer"
              >
                <div className="grid place-items-center rounded-lg bg-blue-100 p-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="grid gap-1">
                  <h3 className="font-semibold text-blue-800">{event.title}</h3>
                  <div className="flex items-center text-sm text-blue-600">
                    <Calendar className="mr-1 h-3 w-3" />
                    <time>{event.date}</time>
                    <span className="mx-1">•</span>
                    <Clock className="mr-1 h-3 w-3" />
                    <time>{event.time}</time>
                  </div>
                  <p className="text-sm text-blue-600">{event.description}</p>
                  <p className="text-xs text-blue-500 mt-1">Địa điểm: {event.location}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/dashboard/events" className="block">
            <Button variant="outline" className="w-full group border-blue-200 text-blue-700 hover:bg-blue-100">
              Xem tất cả sự kiện
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </TabsContent>

        <TabsContent value="messages" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-800">Tin nhắn gần đây</h2>
            <Link href="/dashboard/messages/new">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="mr-2 h-4 w-4" />
                Tin nhắn mới
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                from: "BS. Nguyễn Thị Hương",
                subject: "Kết quả kiểm tra sức khỏe định kỳ",
                preview:
                  "Kính gửi phụ huynh, Tôi xin gửi kết quả kiểm tra sức khỏe định kỳ của bé Nguyễn Văn An. Nhìn chung, sức khỏe của bé phát triển tốt...",
                time: "2 giờ trước",
                unread: true,
              },
              {
                from: "Y tá Trần Thị Lan",
                subject: "Thông báo tiêm chủng vắc-xin phòng cúm",
                preview:
                  "Kính gửi phụ huynh, Nhà trường sẽ tổ chức buổi tiêm chủng vắc-xin phòng cúm vào ngày 25/05/2025. Đề nghị phụ huynh xác nhận...",
                time: "1 ngày trước",
                unread: true,
              },
              {
                from: "ThS. Lê Thị Mai",
                subject: "Tư vấn dinh dưỡng học đường",
                preview:
                  "Kính gửi phụ huynh, Nhà trường tổ chức buổi tư vấn dinh dưỡng học đường vào ngày 01/06/2025. Kính mời phụ huynh tham dự...",
                time: "3 ngày trước",
                unread: false,
              },
            ].map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  message.unread ? "border-blue-100 bg-blue-50/30" : ""
                } hover:border-blue-300 transition-all duration-200 cursor-pointer`}
              >
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-700">{message.from.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium flex items-center text-blue-800">
                      {message.from}
                      {message.unread && <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>}
                    </h4>
                    <span className="text-xs text-blue-500">{message.time}</span>
                  </div>
                  <p className="text-sm font-medium mt-1 text-blue-700">{message.subject}</p>
                  <p className="text-sm text-blue-600 mt-1 line-clamp-2">{message.preview}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/dashboard/messages" className="block">
            <Button variant="outline" className="w-full group border-blue-200 text-blue-700 hover:bg-blue-100">
              Xem tất cả tin nhắn
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </TabsContent>

        <TabsContent value="resources" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-800">Tài liệu sức khỏe</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Hướng dẫn dinh dưỡng cho học sinh tiểu học",
                type: "PDF",
                size: "2.5 MB",
                date: "15/04/2025",
                category: "Dinh dưỡng",
              },
              {
                title: "Phòng ngừa các bệnh thường gặp ở trẻ em mùa hè",
                type: "PDF",
                size: "1.8 MB",
                date: "10/05/2025",
                category: "Phòng bệnh",
              },
              {
                title: "Hướng dẫn chăm sóc mắt cho học sinh",
                type: "PDF",
                size: "1.2 MB",
                date: "01/05/2025",
                category: "Chăm sóc mắt",
              },
              {
                title: "Lịch tiêm chủng cơ bản cho trẻ em",
                type: "PDF",
                size: "0.9 MB",
                date: "20/04/2025",
                category: "Tiêm chủng",
              },
            ].map((resource, index) => (
              <div
                key={index}
                className="rounded-lg border border-blue-100 p-4 hover:border-blue-300 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-800">{resource.title}</h4>
                    <div className="flex items-center mt-2 text-xs text-blue-500">
                      <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-700">
                        {resource.category}
                      </Badge>
                      <span>{resource.type}</span>
                      <span className="mx-1">•</span>
                      <span>{resource.size}</span>
                      <span className="mx-1">•</span>
                      <span>{resource.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/dashboard/resources" className="block">
            <Button variant="outline" className="w-full group border-blue-200 text-blue-700 hover:bg-blue-100">
              Xem tất cả tài liệu
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </TabsContent>
      </Tabs>
    </div>
  )
}

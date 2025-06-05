"use client"

import { useState } from "react"
import { AlertTriangle, Plus, Search, Clock, User, MapPin, Phone, FileText, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MedicalEvents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-teal-800">Sự kiện Y tế</h1>
        <p className="text-teal-600">Quản lý và xử lý các sự kiện y tế đột xuất</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Sự kiện hôm nay</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">5</div>
            <p className="text-xs text-red-600">Cần xử lý ngay</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Đang xử lý</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">8</div>
            <p className="text-xs text-orange-600">Theo dõi tiếp</p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Đã xử lý</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">42</div>
            <p className="text-xs text-green-600">Tuần này</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Tổng sự kiện</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">156</div>
            <p className="text-xs text-blue-600">Tháng này</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-teal-50">
          <TabsTrigger value="active" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Đang xử lý
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Đã xử lý
          </TabsTrigger>
          <TabsTrigger value="emergency" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Khẩn cấp
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Báo cáo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-teal-800">Sự kiện đang xử lý</CardTitle>
                  <CardDescription className="text-teal-600">
                    Danh sách các sự kiện y tế cần theo dõi và xử lý
                  </CardDescription>
                </div>
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm sự kiện
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm sự kiện..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="new">Mới</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="waiting">Chờ phụ huynh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {activeEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      event.priority === "Cao"
                        ? "border-l-red-500 bg-red-50"
                        : event.priority === "Trung bình"
                          ? "border-l-yellow-500 bg-yellow-50"
                          : "border-l-blue-500 bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900">{event.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {event.student} - {event.class}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={event.priority === "Cao" ? "destructive" : "secondary"}
                        className={
                          event.priority === "Cao"
                            ? "bg-red-100 text-red-800"
                            : event.priority === "Trung bình"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }
                      >
                        {event.priority}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{event.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>Đã liên hệ: {event.contactStatus}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Cập nhật
                        </Button>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                          Xử lý
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-teal-800">Sự kiện đã xử lý</CardTitle>
              <CardDescription className="text-teal-600">Lịch sử các sự kiện y tế đã được giải quyết</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-600">
                          {event.student} - {event.class} | {event.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Đã xử lý</Badge>
                      <Button variant="ghost" size="sm">
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-800">Sự kiện khẩn cấp</CardTitle>
              <CardDescription className="text-red-600">Các trường hợp cần xử lý ngay lập tức</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyEvents.map((event, index) => (
                  <div key={index} className="p-4 rounded-lg border-2 border-red-200 bg-red-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <h4 className="font-semibold text-red-900">{event.title}</h4>
                      </div>
                      <Badge className="bg-red-100 text-red-800">KHẨN CẤP</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-red-800">
                          <strong>Học sinh:</strong> {event.student}
                        </p>
                        <p className="text-sm text-red-800">
                          <strong>Lớp:</strong> {event.class}
                        </p>
                        <p className="text-sm text-red-800">
                          <strong>Thời gian:</strong> {event.time}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-red-800">
                          <strong>Địa điểm:</strong> {event.location}
                        </p>
                        <p className="text-sm text-red-800">
                          <strong>Người báo:</strong> {event.reporter}
                        </p>
                        <p className="text-sm text-red-800">
                          <strong>Liên hệ PH:</strong> {event.parentContact}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-red-700 mb-3">{event.description}</p>

                    <div className="flex gap-2">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Xử lý ngay
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-200 text-red-700">
                        Gọi 115
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-200 text-red-700">
                        Liên hệ PH
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-teal-800">Thống kê theo loại sự kiện</CardTitle>
                <CardDescription className="text-teal-600">Phân loại sự kiện y tế trong tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eventTypeStats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-teal-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${stat.color}`}></div>
                        <div>
                          <div className="font-medium text-teal-800">{stat.type}</div>
                          <div className="text-sm text-teal-600">{stat.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-teal-800">{stat.count}</div>
                        <div className="text-xs text-gray-500">{stat.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-teal-800">Thời gian xử lý trung bình</CardTitle>
                <CardDescription className="text-teal-600">Hiệu quả xử lý sự kiện y tế</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {responseTimeStats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-teal-700 font-medium">{stat.priority}</span>
                        <span className="text-teal-800">{stat.avgTime}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${stat.color}`}
                          style={{ width: `${stat.performance}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Mục tiêu: {stat.target} | Hiệu suất: {stat.performance}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const activeEvents = [
  {
    title: "Học sinh bị dị ứng thức ăn",
    student: "Nguyễn Văn An",
    class: "Lớp 1A",
    time: "11:30 - 16/12/2024",
    location: "Phòng ăn",
    priority: "Cao",
    description: "Học sinh xuất hiện mề đay và ngứa sau khi ăn trưa. Đã sơ cứu ban đầu và cách ly khỏi nguồn dị ứng.",
    contactStatus: "Phụ huynh",
  },
  {
    title: "Té ngã trong sân chơi",
    student: "Trần Thị Bình",
    class: "Lớp 2B",
    time: "10:15 - 16/12/2024",
    location: "Sân chơi",
    priority: "Trung bình",
    description: "Học sinh bị té ngã khi chơi, xây xát nhẹ ở đầu gối. Đã vệ sinh và băng bó vết thương.",
    contactStatus: "Chưa liên hệ",
  },
  {
    title: "Đau bụng đột ngột",
    student: "Lê Hoàng Cường",
    class: "Lớp 3A",
    time: "14:20 - 16/12/2024",
    location: "Lớp học",
    priority: "Trung bình",
    description: "Học sinh than đau bụng, có dấu hiệu buồn nôn. Đang theo dõi và cho nghỉ ngơi.",
    contactStatus: "Đang gọi",
  },
]

const completedEvents = [
  {
    title: "Sốt cao",
    student: "Phạm Thị Dung",
    class: "Lớp 2A",
    date: "15/12/2024",
  },
  {
    title: "Chảy máu cam",
    student: "Hoàng Văn Em",
    class: "Lớp 1B",
    date: "14/12/2024",
  },
  {
    title: "Đau đầu",
    student: "Nguyễn Thị Giang",
    class: "Lớp 3B",
    date: "13/12/2024",
  },
]

const emergencyEvents = [
  {
    title: "Ngạt thở do dị ứng nghiêm trọng",
    student: "Trần Văn Hùng",
    class: "Lớp 2A",
    time: "13:45 - 16/12/2024",
    location: "Phòng ăn",
    reporter: "Cô Lan - Giáo viên",
    parentContact: "Đã gọi - Đang đến",
    description:
      "Học sinh có phản ứng dị ứng nghiêm trọng với tôm, khó thở, sưng mặt. Đã tiêm thuốc khẩn cấp và chuẩn bị chuyển viện.",
  },
]

const eventTypeStats = [
  {
    type: "Té ngã, chấn thương",
    description: "Tai nạn trong hoạt động",
    count: 45,
    percentage: 29,
    color: "bg-red-500",
  },
  {
    type: "Dị ứng thức ăn",
    description: "Phản ứng dị ứng",
    count: 28,
    percentage: 18,
    color: "bg-orange-500",
  },
  {
    type: "Sốt, cảm lạnh",
    description: "Bệnh thông thường",
    count: 35,
    percentage: 22,
    color: "bg-yellow-500",
  },
  {
    type: "Đau bụng",
    description: "Vấn đề tiêu hóa",
    count: 25,
    percentage: 16,
    color: "bg-green-500",
  },
  {
    type: "Khác",
    description: "Các trường hợp khác",
    count: 23,
    percentage: 15,
    color: "bg-blue-500",
  },
]

const responseTimeStats = [
  {
    priority: "Khẩn cấp",
    avgTime: "2 phút",
    target: "< 3 phút",
    performance: 95,
    color: "bg-green-500",
  },
  {
    priority: "Cao",
    avgTime: "8 phút",
    target: "< 10 phút",
    performance: 88,
    color: "bg-yellow-500",
  },
  {
    priority: "Trung bình",
    avgTime: "18 phút",
    target: "< 20 phút",
    performance: 92,
    color: "bg-blue-500",
  },
  {
    priority: "Thấp",
    avgTime: "35 phút",
    target: "< 45 phút",
    performance: 85,
    color: "bg-gray-500",
  },
]

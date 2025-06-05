"use client"

import { useState } from "react"
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Send, Filter, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Feedback() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRating, setSelectedRating] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">Phản hồi</h1>
        <p className="text-blue-600">Quản lý phản hồi từ phụ huynh và học sinh</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Tổng phản hồi</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">156</div>
            <p className="text-xs text-blue-600">Tháng này</p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Đánh giá tích cực</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">128</div>
            <p className="text-xs text-green-600">82% phản hồi</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Đánh giá trung bình</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">4.6</div>
            <p className="text-xs text-yellow-600">Trên thang điểm 5</p>
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Cần xử lý</CardTitle>
            <ThumbsDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">8</div>
            <p className="text-xs text-red-600">Phản hồi tiêu cực</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-blue-50">
          <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Tất cả
          </TabsTrigger>
          <TabsTrigger value="positive" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Tích cực
          </TabsTrigger>
          <TabsTrigger value="negative" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Tiêu cực
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Góp ý
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-blue-800">Tất cả phản hồi</CardTitle>
                  <CardDescription className="text-blue-600">
                    Danh sách phản hồi từ phụ huynh và học sinh
                  </CardDescription>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Gửi thông báo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm phản hồi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Đánh giá" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="5">5 sao</SelectItem>
                    <SelectItem value="4">4 sao</SelectItem>
                    <SelectItem value="3">3 sao</SelectItem>
                    <SelectItem value="2">2 sao</SelectItem>
                    <SelectItem value="1">1 sao</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {allFeedback.map((feedback, index) => (
                  <div key={index} className="p-4 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800">{feedback.author}</h4>
                          <p className="text-sm text-blue-600">
                            {feedback.relation} - {feedback.studentClass}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < feedback.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <Badge
                          variant={
                            feedback.type === "Tích cực"
                              ? "default"
                              : feedback.type === "Tiêu cực"
                                ? "destructive"
                                : "secondary"
                          }
                          className={
                            feedback.type === "Tích cực"
                              ? "bg-green-100 text-green-800"
                              : feedback.type === "Tiêu cực"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {feedback.type}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{feedback.content}</p>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{feedback.date}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Trả lời
                        </Button>
                        {feedback.type === "Tiêu cực" && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Xử lý
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positive" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Phản hồi tích cực</CardTitle>
              <CardDescription className="text-green-600">
                Những đánh giá và nhận xét tích cực từ phụ huynh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positiveFeedback.map((feedback, index) => (
                  <div key={index} className="p-4 rounded-lg border border-green-100 bg-green-50">
                    <div className="flex items-center gap-3 mb-3">
                      <ThumbsUp className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium text-green-800">{feedback.author}</h4>
                        <p className="text-sm text-green-600">{feedback.relation}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        {[...Array(feedback.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-green-700 mb-2">{feedback.content}</p>
                    <p className="text-sm text-green-600">{feedback.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="negative" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-800">Phản hồi tiêu cực</CardTitle>
              <CardDescription className="text-red-600">Những phản hồi cần được xử lý và cải thiện</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {negativeFeedback.map((feedback, index) => (
                  <div key={index} className="p-4 rounded-lg border border-red-100 bg-red-50">
                    <div className="flex items-center gap-3 mb-3">
                      <ThumbsDown className="h-5 w-5 text-red-600" />
                      <div>
                        <h4 className="font-medium text-red-800">{feedback.author}</h4>
                        <p className="text-sm text-red-600">{feedback.relation}</p>
                      </div>
                      <div className="ml-auto">
                        <Badge className="bg-red-100 text-red-800">Cần xử lý</Badge>
                      </div>
                    </div>
                    <p className="text-red-700 mb-3">{feedback.content}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-red-600">{feedback.date}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-red-200 text-red-700">
                          Liên hệ
                        </Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Xử lý ngay
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800">Góp ý cải thiện</CardTitle>
                <CardDescription className="text-blue-600">
                  Những đề xuất từ phụ huynh để cải thiện dịch vụ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 rounded-lg border border-blue-100 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium text-blue-800">{suggestion.title}</h4>
                      </div>
                      <p className="text-blue-700 text-sm mb-2">{suggestion.content}</p>
                      <div className="flex justify-between items-center text-xs text-blue-600">
                        <span>{suggestion.author}</span>
                        <span>{suggestion.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800">Gửi thông báo phản hồi</CardTitle>
                <CardDescription className="text-blue-600">Trả lời và thông báo đến phụ huynh</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tiêu đề</label>
                    <Input placeholder="Nhập tiêu đề thông báo" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nội dung</label>
                    <Textarea placeholder="Nhập nội dung phản hồi..." className="mt-1 min-h-[120px]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Gửi đến</label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Chọn đối tượng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả phụ huynh</SelectItem>
                        <SelectItem value="class">Theo lớp</SelectItem>
                        <SelectItem value="individual">Cá nhân</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4 mr-2" />
                    Gửi thông báo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const allFeedback = [
  {
    author: "Nguyễn Thị Lan",
    relation: "Phụ huynh",
    studentClass: "Lớp 1A",
    rating: 5,
    type: "Tích cực",
    content: "Tôi rất hài lòng với chất lượng chăm sóc sức khỏe cho con. Các cô giáo y tế rất tận tâm và chu đáo.",
    date: "16/12/2024",
  },
  {
    author: "Trần Văn Minh",
    relation: "Phụ huynh",
    studentClass: "Lớp 2B",
    rating: 2,
    type: "Tiêu cực",
    content: "Thời gian chờ khám quá lâu, con tôi phải chờ 30 phút mới được khám. Mong nhà trường cải thiện.",
    date: "15/12/2024",
  },
  {
    author: "Lê Thị Hoa",
    relation: "Phụ huynh",
    studentClass: "Lớp 3A",
    rating: 4,
    type: "Góp ý",
    content: "Dịch vụ tốt nhưng mong có thêm thông tin chi tiết về tình trạng sức khỏe của con qua app.",
    date: "14/12/2024",
  },
]

const positiveFeedback = [
  {
    author: "Phạm Thị Mai",
    relation: "Phụ huynh học sinh lớp 1B",
    rating: 5,
    content: "Cảm ơn cô y tế đã chăm sóc con tôi khi bé bị dị ứng. Xử lý rất nhanh và chuyên nghiệp.",
    date: "16/12/2024",
  },
  {
    author: "Hoàng Văn Đức",
    relation: "Phụ huynh học sinh lớp 2A",
    rating: 5,
    content: "Thực đơn bán trú rất đa dạng và bổ dưỡng. Con tôi rất thích ăn ở trường.",
    date: "15/12/2024",
  },
  {
    author: "Nguyễn Thị Bích",
    relation: "Phụ huynh học sinh lớp 3B",
    rating: 4,
    content: "Hệ thống theo dõi sức khỏe rất tốt, tôi luôn được cập nhật tình hình của con.",
    date: "14/12/2024",
  },
]

const negativeFeedback = [
  {
    author: "Trần Thị Nga",
    relation: "Phụ huynh học sinh lớp 1A",
    content: "Con tôi bị dị ứng nhưng không được thông báo kịp thời. Mong nhà trường cải thiện việc liên lạc.",
    date: "15/12/2024",
  },
  {
    author: "Lê Văn Tùng",
    relation: "Phụ huynh học sinh lớp 2B",
    content: "Phòng y tế thiếu thuốc cơ bản, con tôi đau đầu mà không có thuốc để uống.",
    date: "13/12/2024",
  },
]

const suggestions = [
  {
    title: "Cải thiện thực đơn",
    content: "Nên có thêm món chay và giảm độ mặn trong các món ăn",
    author: "Nguyễn Thị Hương",
    date: "16/12/2024",
  },
  {
    title: "Ứng dụng mobile",
    content: "Mong có app để theo dõi sức khỏe con trực tiếp trên điện thoại",
    author: "Trần Văn Nam",
    date: "15/12/2024",
  },
  {
    title: "Tăng cường hoạt động thể dục",
    content: "Nên có thêm các hoạt động thể thao ngoài trời cho học sinh",
    author: "Lê Thị Lan",
    date: "14/12/2024",
  },
]

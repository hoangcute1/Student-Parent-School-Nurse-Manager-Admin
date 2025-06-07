import { Send, Star, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function FeedbackPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">Phản hồi & Đánh giá</h1>
        <p className="text-blue-600">Chia sẻ ý kiến và đánh giá về dịch vụ y tế học đường</p>
      </div>

      <Tabs defaultValue="new-feedback" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-blue-50">
          <TabsTrigger value="new-feedback" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Gửi phản hồi mới
          </TabsTrigger>
          <TabsTrigger value="my-feedback" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Phản hồi của tôi
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Góp ý cải thiện
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new-feedback" className="mt-6 space-y-6">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-800">Gửi phản hồi mới</CardTitle>
              <CardDescription className="text-blue-600">
                Chia sẻ trải nghiệm của bạn về dịch vụ y tế học đường
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Loại phản hồi</Label>
                  <Select>
                    <SelectTrigger className="border-blue-200">
                      <SelectValue placeholder="Chọn loại phản hồi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Chất lượng dịch vụ</SelectItem>
                      <SelectItem value="staff">Nhân viên y tế</SelectItem>
                      <SelectItem value="facility">Cơ sở vật chất</SelectItem>
                      <SelectItem value="communication">Giao tiếp thông tin</SelectItem>
                      <SelectItem value="system">Hệ thống website</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Đánh giá tổng thể</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-6 w-6 cursor-pointer text-yellow-400 fill-yellow-400 hover:text-yellow-500"
                      />
                    ))}
                    <span className="text-sm text-blue-600 ml-2">5/5 - Rất hài lòng</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề phản hồi</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề ngắn gọn cho phản hồi của bạn"
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung chi tiết</Label>
                <Textarea
                  id="content"
                  placeholder="Chia sẻ chi tiết về trải nghiệm của bạn..."
                  className="min-h-[120px] border-blue-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestions">Đề xuất cải thiện (tùy chọn)</Label>
                <Textarea
                  id="suggestions"
                  placeholder="Bạn có đề xuất gì để cải thiện dịch vụ không?"
                  className="min-h-[80px] border-blue-200 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Send className="mr-2 h-4 w-4" />
                  Gửi phản hồi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-feedback" className="mt-6 space-y-4">
          <div className="space-y-4">
            {myFeedbacks.map((feedback, index) => (
              <Card key={index} className="border-blue-100 hover:border-blue-300 transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-blue-800">{feedback.title}</CardTitle>
                      <CardDescription className="text-blue-600">
                        {feedback.category} • {feedback.date}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < feedback.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <Badge variant={getStatusVariant(feedback.status)} className={getStatusColor(feedback.status)}>
                        {feedback.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700 mb-3">{feedback.content}</p>
                  {feedback.response && (
                    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                      <h4 className="font-medium text-blue-800 mb-1">Phản hồi từ nhà trường:</h4>
                      <p className="text-sm text-blue-700">{feedback.response}</p>
                      <p className="text-xs text-blue-500 mt-2">Phản hồi bởi: {feedback.responder}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6 space-y-6">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-800">Góp ý cải thiện dịch vụ</CardTitle>
              <CardDescription className="text-blue-600">
                Đề xuất những ý tưởng để nâng cao chất lượng dịch vụ y tế học đường
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="suggestion-title">Tiêu đề đề xuất</Label>
                <Input
                  id="suggestion-title"
                  placeholder="Nhập tiêu đề cho đề xuất của bạn"
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestion-content">Chi tiết đề xuất</Label>
                <Textarea
                  id="suggestion-content"
                  placeholder="Mô tả chi tiết đề xuất cải thiện của bạn..."
                  className="min-h-[120px] border-blue-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Mức độ ưu tiên</Label>
                <Select>
                  <SelectTrigger className="border-blue-200">
                    <SelectValue placeholder="Chọn mức độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Send className="mr-2 h-4 w-4" />
                  Gửi đề xuất
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-800">Đề xuất phổ biến từ phụ huynh</h3>
            {popularSuggestions.map((suggestion, index) => (
              <Card key={index} className="border-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-800">{suggestion.title}</h4>
                      <p className="text-sm text-blue-600 mt-1">{suggestion.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-700">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {suggestion.votes}
                      </Button>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {suggestion.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getStatusVariant(status: string) {
  switch (status) {
    case "Đã phản hồi":
      return "default"
    case "Đang xử lý":
      return "secondary"
    case "Chờ xử lý":
      return "outline"
    default:
      return "outline"
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Đã phản hồi":
      return "bg-green-100 text-green-800"
    case "Đang xử lý":
      return "bg-yellow-100 text-yellow-800"
    case "Chờ xử lý":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const myFeedbacks = [
  {
    title: "Dịch vụ y tế rất tốt",
    category: "Chất lượng dịch vụ",
    date: "15/05/2025",
    rating: 5,
    content: "Nhân viên y tế rất chu đáo và chuyên nghiệp. Con tôi được chăm sóc rất tốt khi bị ốm.",
    status: "Đã phản hồi",
    response: "Cảm ơn phụ huynh đã đánh giá tích cực. Chúng tôi sẽ tiếp tục nỗ lực để mang lại dịch vụ tốt nhất.",
    responder: "BS. Nguyễn Thị Hương",
  },
  {
    title: "Cần cải thiện thời gian chờ",
    category: "Cơ sở vật chất",
    date: "10/05/2025",
    rating: 3,
    content: "Thời gian chờ khám hơi lâu, hy vọng nhà trường có thể cải thiện.",
    status: "Đang xử lý",
    response: null,
    responder: null,
  },
  {
    title: "Website dễ sử dụng",
    category: "Hệ thống website",
    date: "05/05/2025",
    rating: 4,
    content: "Giao diện website rất thân thiện, dễ theo dõi thông tin sức khỏe của con.",
    status: "Chờ xử lý",
    response: null,
    responder: null,
  },
]

const popularSuggestions = [
  {
    title: "Thêm tính năng nhắc nhở uống thuốc",
    description: "Hệ thống tự động nhắc nhở khi đến giờ uống thuốc cho học sinh",
    votes: 24,
    status: "Đang phát triển",
  },
  {
    title: "Mở rộng giờ làm việc phòng y tế",
    description: "Phòng y tế mở cửa sớm hơn và đóng cửa muộn hơn",
    votes: 18,
    status: "Đang xem xét",
  },
  {
    title: "Thêm bác sĩ chuyên khoa",
    description: "Có thêm bác sĩ chuyên khoa nhi để tư vấn chuyên sâu",
    votes: 15,
    status: "Đã tiếp nhận",
  },
]

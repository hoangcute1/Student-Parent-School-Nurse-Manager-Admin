import Link from "next/link"
import { ChevronDown, Download, Filter, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EventsPage() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">Sự kiện y tế</h1>
          <p className="text-blue-600">Quản lý các sự kiện y tế trong trường học</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/events/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Thêm sự kiện mới
            </Button>
          </Link>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-800">156</div>
                <div className="text-sm text-blue-600">Tổng sự kiện</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-800">124</div>
                <div className="text-sm text-green-600">Đã giải quyết</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 font-bold">!</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-800">18</div>
                <div className="text-sm text-yellow-600">Đang theo dõi</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-800">14</div>
                <div className="text-sm text-red-600">Đang xử lý</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] border-blue-200">
              <SelectValue placeholder="Loại sự kiện" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả sự kiện</SelectItem>
              <SelectItem value="accident">Tai nạn</SelectItem>
              <SelectItem value="illness">Ốm đau</SelectItem>
              <SelectItem value="injury">Chấn thương</SelectItem>
              <SelectItem value="epidemic">Dịch bệnh</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] border-blue-200">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="open">Đang xử lý</SelectItem>
              <SelectItem value="resolved">Đã giải quyết</SelectItem>
              <SelectItem value="monitoring">Đang theo dõi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
            <Input type="search" placeholder="Tìm kiếm..." className="w-full rounded-lg pl-8 md:w-[300px] border-blue-200 focus:border-blue-500" />
          </div>
          <Button variant="outline" size="icon" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Lọc</span>
          </Button>
          <Button variant="outline" size="icon" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Download className="h-4 w-4" />
            <span className="sr-only">Xuất</span>
          </Button>
        </div>
      </div>

      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-800">Danh sách sự kiện y tế</CardTitle>
          <CardDescription className="text-blue-600">Tổng hợp các sự kiện y tế đã xảy ra trong trường học</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-blue-50">
              <TableRow>
                <TableHead className="text-blue-800">ID</TableHead>
                <TableHead className="text-blue-800">Học sinh</TableHead>
                <TableHead className="text-blue-800">Lớp</TableHead>
                <TableHead className="text-blue-800">Loại sự kiện</TableHead>
                <TableHead className="text-blue-800">Mô tả</TableHead>
                <TableHead className="text-blue-800">Thời gian</TableHead>
                <TableHead className="text-blue-800">Trạng thái</TableHead>
                <TableHead className="text-blue-800">Người xử lý</TableHead>
                <TableHead className="text-blue-800"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  id: "SK001",
                  student: "Nguyễn Văn An",
                  class: "1A",
                  type: "Tai nạn",
                  description: "Té ngã trong giờ ra chơi",
                  time: "15/05/2025 09:30",
                  status: "Đã giải quyết",
                  handler: "Nguyễn Thị Y Tá",
                },
                {
                  id: "SK002",
                  student: "Trần Thị Bình",
                  class: "2B",
                  type: "Ốm đau",
                  description: "Sốt cao 38.5°C",
                  time: "14/05/2025 11:15",
                  status: "Đang theo dõi",
                  handler: "Nguyễn Thị Y Tá",
                },
                {
                  id: "SK003",
                  student: "Lê Hoàng Cường",
                  class: "3C",
                  type: "Dị ứng",
                  description: "Nổi mề đay sau bữa trưa",
                  time: "13/05/2025 13:45",
                  status: "Đã giải quyết",
                  handler: "Trần Văn Bác Sĩ",
                },
                {
                  id: "SK004",
                  student: "Phạm Minh Dương",
                  class: "4A",
                  type: "Chấn thương",
                  description: "Bong gân cổ tay trong giờ thể dục",
                  time: "12/05/2025 14:20",
                  status: "Đang xử lý",
                  handler: "Trần Văn Bác Sĩ",
                },
                {
                  id: "SK005",
                  student: "Hoàng Thị Lan",
                  class: "5B",
                  type: "Dịch bệnh",
                  description: "Triệu chứng cúm, đã cách ly",
                  time: "11/05/2025 08:10",
                  status: "Đang theo dõi",
                  handler: "Nguyễn Thị Y Tá",
                },
              ].map((event, index) => (
                <TableRow key={index} className="hover:bg-blue-50">
                  <TableCell className="font-medium text-blue-800">{event.id}</TableCell>
                  <TableCell className="text-blue-700">{event.student}</TableCell>
                  <TableCell className="text-blue-700">{event.class}</TableCell>
                  <TableCell className="text-blue-700">{event.type}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-blue-700">{event.description}</TableCell>
                  <TableCell className="text-blue-700">{event.time}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.status === "Đã giải quyết"
                          ? "outline"
                          : event.status === "Đang xử lý"
                            ? "destructive"
                            : "secondary"
                      }
                      className={
                        event.status === "Đã giải quyết"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : event.status === "Đang xử lý"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-blue-700">{event.handler}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100 hover:text-blue-900">
                      Chi tiết
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

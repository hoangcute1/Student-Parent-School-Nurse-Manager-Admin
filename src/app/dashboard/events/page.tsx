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
          <h1 className="text-3xl font-bold tracking-tight">Sự kiện y tế</h1>
          <p className="text-gray-500">Quản lý các sự kiện y tế trong trường học</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/events/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm sự kiện mới
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
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
            <SelectTrigger className="w-[180px]">
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
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Tìm kiếm..." className="w-full rounded-lg pl-8 md:w-[300px]" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Lọc</span>
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
            <span className="sr-only">Xuất</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sự kiện y tế</CardTitle>
          <CardDescription>Tổng hợp các sự kiện y tế đã xảy ra trong trường học</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Học sinh</TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead>Loại sự kiện</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Người xử lý</TableHead>
                <TableHead></TableHead>
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
                <TableRow key={index}>
                  <TableCell className="font-medium">{event.id}</TableCell>
                  <TableCell>{event.student}</TableCell>
                  <TableCell>{event.class}</TableCell>
                  <TableCell>{event.type}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{event.description}</TableCell>
                  <TableCell>{event.time}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.status === "Đã giải quyết"
                          ? "outline"
                          : event.status === "Đang xử lý"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{event.handler}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
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

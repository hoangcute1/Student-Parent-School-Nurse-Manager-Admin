import Link from "next/link"
import { ChevronDown, Download, Filter, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HealthRecordsPage() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hồ sơ sức khỏe</h1>
          <p className="text-gray-500">Quản lý thông tin sức khỏe của học sinh</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/health-records/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm hồ sơ mới
            </Button>
          </Link>
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="allergies">Dị ứng</TabsTrigger>
            <TabsTrigger value="chronic">Bệnh mãn tính</TabsTrigger>
            <TabsTrigger value="vaccinations">Tiêm chủng</TabsTrigger>
          </TabsList>
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
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách hồ sơ sức khỏe</CardTitle>
              <CardDescription>Tổng hợp thông tin sức khỏe của tất cả học sinh</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Dị ứng</TableHead>
                    <TableHead>Bệnh mãn tính</TableHead>
                    <TableHead>Thị lực</TableHead>
                    <TableHead>Cập nhật lần cuối</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "Nguyễn Văn An",
                      class: "1A",
                      allergies: "Hải sản",
                      chronic: "Không",
                      vision: "Bình thường",
                      lastUpdated: "10/05/2025",
                    },
                    {
                      name: "Trần Thị Bình",
                      class: "2B",
                      allergies: "Không",
                      chronic: "Hen suyễn",
                      vision: "Cận thị nhẹ",
                      lastUpdated: "05/05/2025",
                    },
                    {
                      name: "Lê Hoàng Cường",
                      class: "3C",
                      allergies: "Phấn hoa",
                      chronic: "Không",
                      vision: "Bình thường",
                      lastUpdated: "01/05/2025",
                    },
                    {
                      name: "Phạm Minh Dương",
                      class: "4A",
                      allergies: "Không",
                      chronic: "Không",
                      vision: "Bình thường",
                      lastUpdated: "28/04/2025",
                    },
                    {
                      name: "Hoàng Thị Lan",
                      class: "5B",
                      allergies: "Đậu phộng",
                      chronic: "Tiểu đường type 1",
                      vision: "Cận thị",
                      lastUpdated: "25/04/2025",
                    },
                  ].map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.class}</TableCell>
                      <TableCell>{record.allergies}</TableCell>
                      <TableCell>{record.chronic}</TableCell>
                      <TableCell>{record.vision}</TableCell>
                      <TableCell>{record.lastUpdated}</TableCell>
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
        </TabsContent>
        <TabsContent value="allergies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách học sinh có dị ứng</CardTitle>
              <CardDescription>Thông tin về các loại dị ứng của học sinh</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Loại dị ứng</TableHead>
                    <TableHead>Mức độ</TableHead>
                    <TableHead>Biểu hiện</TableHead>
                    <TableHead>Xử lý khi phát sinh</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "Nguyễn Văn An",
                      class: "1A",
                      type: "Hải sản",
                      severity: "Trung bình",
                      symptoms: "Nổi mề đay, ngứa",
                      treatment: "Uống thuốc kháng histamine",
                    },
                    {
                      name: "Lê Hoàng Cường",
                      class: "3C",
                      type: "Phấn hoa",
                      severity: "Nhẹ",
                      symptoms: "Hắt hơi, chảy nước mũi",
                      treatment: "Uống thuốc kháng histamine",
                    },
                    {
                      name: "Hoàng Thị Lan",
                      class: "5B",
                      type: "Đậu phộng",
                      severity: "Nặng",
                      symptoms: "Khó thở, sưng mặt",
                      treatment: "Tiêm EpiPen, đưa đến bệnh viện ngay",
                    },
                  ].map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.class}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.severity}</TableCell>
                      <TableCell>{record.symptoms}</TableCell>
                      <TableCell>{record.treatment}</TableCell>
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
        </TabsContent>
        <TabsContent value="chronic" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách học sinh có bệnh mãn tính</CardTitle>
              <CardDescription>Thông tin về các bệnh mãn tính của học sinh</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Bệnh mãn tính</TableHead>
                    <TableHead>Thuốc điều trị</TableHead>
                    <TableHead>Lưu ý đặc biệt</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "Trần Thị Bình",
                      class: "2B",
                      condition: "Hen suyễn",
                      medication: "Ventolin (khi cần)",
                      notes: "Tránh hoạt động thể chất quá sức",
                    },
                    {
                      name: "Hoàng Thị Lan",
                      class: "5B",
                      condition: "Tiểu đường type 1",
                      medication: "Insulin",
                      notes: "Theo dõi đường huyết, có thể cần tiêm insulin",
                    },
                  ].map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.class}</TableCell>
                      <TableCell>{record.condition}</TableCell>
                      <TableCell>{record.medication}</TableCell>
                      <TableCell>{record.notes}</TableCell>
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
        </TabsContent>
        <TabsContent value="vaccinations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử tiêm chủng</CardTitle>
              <CardDescription>Thông tin về các mũi tiêm chủng của học sinh</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Loại vắc-xin</TableHead>
                    <TableHead>Ngày tiêm</TableHead>
                    <TableHead>Nơi tiêm</TableHead>
                    <TableHead>Phản ứng sau tiêm</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "Nguyễn Văn An",
                      class: "1A",
                      vaccine: "Sởi-Quai bị-Rubella",
                      date: "15/01/2025",
                      location: "Trung tâm Y tế Quận 1",
                      reaction: "Không",
                    },
                    {
                      name: "Trần Thị Bình",
                      class: "2B",
                      vaccine: "Viêm não Nhật Bản",
                      date: "20/02/2025",
                      location: "Bệnh viện Nhi Đồng",
                      reaction: "Sốt nhẹ",
                    },
                    {
                      name: "Lê Hoàng Cường",
                      class: "3C",
                      vaccine: "Cúm mùa",
                      date: "10/03/2025",
                      location: "Trường học",
                      reaction: "Không",
                    },
                  ].map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.class}</TableCell>
                      <TableCell>{record.vaccine}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.location}</TableCell>
                      <TableCell>{record.reaction}</TableCell>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}

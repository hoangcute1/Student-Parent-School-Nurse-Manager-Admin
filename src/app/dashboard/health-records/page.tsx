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
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">Hồ sơ sức khỏe</h1>
          <p className="text-blue-600">Quản lý thông tin sức khỏe của học sinh</p>
        </div>
         
      </div>
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="bg-blue-50">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Tất cả
            </TabsTrigger>
            <TabsTrigger value="allergies" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Dị ứng
            </TabsTrigger>
            <TabsTrigger value="chronic" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Bệnh mãn tính
            </TabsTrigger>
            <TabsTrigger
              value="vaccinations"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Tiêm chủng
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
              <Input
                type="search"
                placeholder="Tìm kiếm..."
                className="w-full rounded-lg pl-8 md:w-[300px] border-blue-200 focus:border-blue-500"
              />
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
        <TabsContent value="all" className="mt-4">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-800">Danh sách hồ sơ sức khỏe</CardTitle>
              <CardDescription className="text-blue-600">
                Tổng hợp thông tin sức khỏe của tất cả học sinh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead className="text-blue-800">Họ tên</TableHead>
                    <TableHead className="text-blue-800">Lớp</TableHead>
                    <TableHead className="text-blue-800">Dị ứng</TableHead>
                    <TableHead className="text-blue-800">Bệnh mãn tính</TableHead>
                    <TableHead className="text-blue-800">Thị lực</TableHead>
                    <TableHead className="text-blue-800">Cập nhật lần cuối</TableHead>
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
                    <TableRow key={index} className="hover:bg-blue-50">
                      <TableCell className="font-medium text-blue-800">{record.name}</TableCell>
                      <TableCell className="text-blue-700">{record.class}</TableCell>
                      <TableCell className="text-blue-700">{record.allergies}</TableCell>
                      <TableCell className="text-blue-700">{record.chronic}</TableCell>
                      <TableCell className="text-blue-700">{record.vision}</TableCell>
                      <TableCell className="text-blue-700">{record.lastUpdated}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100">
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
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-800">Danh sách học sinh có dị ứng</CardTitle>
              <CardDescription className="text-blue-600">Thông tin về các loại dị ứng của học sinh</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead className="text-blue-800">Họ tên</TableHead>
                    <TableHead className="text-blue-800">Lớp</TableHead>
                    <TableHead className="text-blue-800">Loại dị ứng</TableHead>
                    <TableHead className="text-blue-800">Mức độ</TableHead>
                    <TableHead className="text-blue-800">Biểu hiện</TableHead>
                    <TableHead className="text-blue-800">Xử lý khi phát sinh</TableHead>
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
                    <TableRow key={index} className="hover:bg-blue-50">
                      <TableCell className="font-medium text-blue-800">{record.name}</TableCell>
                      <TableCell className="text-blue-700">{record.class}</TableCell>
                      <TableCell className="text-blue-700">{record.type}</TableCell>
                      <TableCell className="text-blue-700">{record.severity}</TableCell>
                      <TableCell className="text-blue-700">{record.symptoms}</TableCell>
                      <TableCell className="text-blue-700">{record.treatment}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100">
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
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-800">Danh sách học sinh có bệnh mãn tính</CardTitle>
              <CardDescription className="text-blue-600">Thông tin về các bệnh mãn tính của học sinh</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead className="text-blue-800">Họ tên</TableHead>
                    <TableHead className="text-blue-800">Lớp</TableHead>
                    <TableHead className="text-blue-800">Bệnh mãn tính</TableHead>
                    <TableHead className="text-blue-800">Thuốc điều trị</TableHead>
                    <TableHead className="text-blue-800">Lưu ý đặc biệt</TableHead>
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
                    <TableRow key={index} className="hover:bg-blue-50">
                      <TableCell className="font-medium text-blue-800">{record.name}</TableCell>
                      <TableCell className="text-blue-700">{record.class}</TableCell>
                      <TableCell className="text-blue-700">{record.condition}</TableCell>
                      <TableCell className="text-blue-700">{record.medication}</TableCell>
                      <TableCell className="text-blue-700">{record.notes}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100">
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
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-800">Lịch sử tiêm chủng</CardTitle>
              <CardDescription className="text-blue-600">Thông tin về các mũi tiêm chủng của học sinh</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead className="text-blue-800">Họ tên</TableHead>
                    <TableHead className="text-blue-800">Lớp</TableHead>
                    <TableHead className="text-blue-800">Loại vắc-xin</TableHead>
                    <TableHead className="text-blue-800">Ngày tiêm</TableHead>
                    <TableHead className="text-blue-800">Nơi tiêm</TableHead>
                    <TableHead className="text-blue-800">Phản ứng sau tiêm</TableHead>
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
                    <TableRow key={index} className="hover:bg-blue-50">
                      <TableCell className="font-medium text-blue-800">{record.name}</TableCell>
                      <TableCell className="text-blue-700">{record.class}</TableCell>
                      <TableCell className="text-blue-700">{record.vaccine}</TableCell>
                      <TableCell className="text-blue-700">{record.date}</TableCell>
                      <TableCell className="text-blue-700">{record.location}</TableCell>
                      <TableCell className="text-blue-700">{record.reaction}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100">
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

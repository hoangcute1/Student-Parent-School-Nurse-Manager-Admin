import Link from "next/link"
import { Calendar, ChevronDown, Download, Filter, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VaccinationsPage() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tiêm chủng</h1>
          <p className="text-gray-500">Quản lý các đợt tiêm chủng tại trường học</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/vaccinations/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm đợt tiêm chủng mới
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Sắp diễn ra</TabsTrigger>
          <TabsTrigger value="ongoing">Đang diễn ra</TabsTrigger>
          <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Các đợt tiêm chủng sắp diễn ra</CardTitle>
              <CardDescription>Thông tin về các đợt tiêm chủng đã lên lịch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    id: "TC001",
                    name: "Tiêm chủng vắc-xin phòng cúm",
                    date: "25/05/2025",
                    vaccine: "Vắc-xin cúm mùa",
                    target: "Học sinh từ lớp 1-5",
                    status: "Đang chuẩn bị",
                    progress: 65,
                    details: "Đã gửi thông báo cho phụ huynh, đang thu thập phiếu đồng ý",
                  },
                  {
                    id: "TC002",
                    name: "Tiêm chủng vắc-xin phòng viêm não Nhật Bản",
                    date: "10/06/2025",
                    vaccine: "Vắc-xin VNNB",
                    target: "Học sinh lớp 1",
                    status: "Đang chuẩn bị",
                    progress: 40,
                    details: "Đang gửi thông báo cho phụ huynh",
                  },
                ].map((campaign, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{campaign.id}</Badge>
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{campaign.date}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <span className="font-medium">Loại vắc-xin:</span> {campaign.vaccine}
                          </div>
                          <div>
                            <span className="font-medium">Đối tượng:</span> {campaign.target}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{campaign.details}</p>
                      </div>
                      <div className="space-y-2 min-w-[200px]">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Tiến độ chuẩn bị</span>
                          <span className="text-sm font-medium">{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
                        <div className="flex justify-end pt-2">
                          <Button size="sm">Xem chi tiết</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ongoing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Các đợt tiêm chủng đang diễn ra</CardTitle>
              <CardDescription>Thông tin về các đợt tiêm chủng đang được thực hiện</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    id: "TC003",
                    name: "Tiêm chủng vắc-xin phòng sởi-quai bị-rubella",
                    date: "15/05/2025 - 17/05/2025",
                    vaccine: "Vắc-xin MMR",
                    target: "Học sinh lớp 1 và lớp 6",
                    status: "Đang tiến hành",
                    progress: 35,
                    details: "Đã tiêm cho 35% học sinh đăng ký, đang tiếp tục theo lịch",
                  },
                ].map((campaign, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge>{campaign.id}</Badge>
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{campaign.date}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <span className="font-medium">Loại vắc-xin:</span> {campaign.vaccine}
                          </div>
                          <div>
                            <span className="font-medium">Đối tượng:</span> {campaign.target}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{campaign.details}</p>
                      </div>
                      <div className="space-y-2 min-w-[200px]">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Tiến độ thực hiện</span>
                          <span className="text-sm font-medium">{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
                        <div className="flex justify-end gap-2 pt-2">
                          <Button variant="outline" size="sm">
                            Cập nhật
                          </Button>
                          <Button size="sm">Xem chi tiết</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Các đợt tiêm chủng đã hoàn thành</CardTitle>
                <CardDescription>Lịch sử các đợt tiêm chủng đã thực hiện</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input type="search" placeholder="Tìm kiếm..." className="w-full rounded-lg pl-8 md:w-[200px]" />
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
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên đợt tiêm chủng</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Loại vắc-xin</TableHead>
                    <TableHead>Số học sinh</TableHead>
                    <TableHead>Tỷ lệ hoàn thành</TableHead>
                    <TableHead>Phản ứng phụ</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: "TC004",
                      name: "Tiêm chủng vắc-xin phòng viêm gan B",
                      date: "10/04/2025 - 12/04/2025",
                      vaccine: "Vắc-xin viêm gan B",
                      students: 120,
                      completion: "95%",
                      reactions: "Nhẹ (2%)",
                    },
                    {
                      id: "TC005",
                      name: "Tiêm chủng vắc-xin phòng bạch hầu-ho gà-uốn ván",
                      date: "15/03/2025 - 18/03/2025",
                      vaccine: "Vắc-xin DPT",
                      students: 85,
                      completion: "100%",
                      reactions: "Nhẹ (5%)",
                    },
                    {
                      id: "TC006",
                      name: "Tiêm chủng vắc-xin phòng cúm mùa đông",
                      date: "20/11/2024 - 22/11/2024",
                      vaccine: "Vắc-xin cúm",
                      students: 200,
                      completion: "92%",
                      reactions: "Không",
                    },
                  ].map((campaign, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{campaign.id}</TableCell>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>{campaign.date}</TableCell>
                      <TableCell>{campaign.vaccine}</TableCell>
                      <TableCell>{campaign.students}</TableCell>
                      <TableCell>{campaign.completion}</TableCell>
                      <TableCell>{campaign.reactions}</TableCell>
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

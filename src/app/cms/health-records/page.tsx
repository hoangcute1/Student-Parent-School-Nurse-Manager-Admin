import { Search, Filter, Download, Plus, Eye, Edit, MoreHorizontal, Users, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StudentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">Quản lý học sinh</h1>
        <p className="text-blue-600">Danh sách tất cả học sinh và thông tin sức khỏe của các em</p>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-800">248</div>
                <div className="text-sm text-blue-600">Tổng học sinh</div>
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
                <div className="text-2xl font-bold text-green-800">236</div>
                <div className="text-sm text-green-600">Sức khỏe tốt</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-800">12</div>
                <div className="text-sm text-yellow-600">Cần theo dõi</div>
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
                <div className="text-2xl font-bold text-red-800">0</div>
                <div className="text-sm text-red-600">Khẩn cấp</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-800">Danh sách học sinh</CardTitle>
          <CardDescription className="text-blue-600">
            Quản lý thông tin và sức khỏe của tất cả học sinh trong trường
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
              <Input
                type="search"
                placeholder="Tìm kiếm theo tên, mã học sinh..."
                className="pl-8 border-blue-200 focus:border-blue-500"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px] border-blue-200">
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                <SelectItem value="1A">Lớp 1A</SelectItem>
                <SelectItem value="1B">Lớp 1B</SelectItem>
                <SelectItem value="2A">Lớp 2A</SelectItem>
                <SelectItem value="2B">Lớp 2B</SelectItem>
                <SelectItem value="3A">Lớp 3A</SelectItem>
                <SelectItem value="3B">Lớp 3B</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] border-blue-200">
                <SelectValue placeholder="Tình trạng sức khỏe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="good">Sức khỏe tốt</SelectItem>
                <SelectItem value="monitor">Cần theo dõi</SelectItem>
                <SelectItem value="urgent">Khẩn cấp</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Xuất danh sách
            </Button>
          </div>

          <div className="rounded-md border border-blue-200">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="text-blue-800">Học sinh</TableHead>
                  <TableHead className="text-blue-800">Lớp</TableHead>
                  <TableHead className="text-blue-800">Ngày sinh</TableHead>
                  <TableHead className="text-blue-800">Phụ huynh</TableHead>
                  <TableHead className="text-blue-800">Tình trạng sức khỏe</TableHead>
                  <TableHead className="text-blue-800">Dị ứng</TableHead>
                  <TableHead className="text-blue-800">Cập nhật cuối</TableHead>
                  <TableHead className="text-right text-blue-800">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={index} className="hover:bg-blue-50 cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-blue-200">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${student.name.charAt(0)}`} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-blue-800">{student.name}</div>
                          <div className="text-sm text-blue-600">{student.studentId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-blue-700">{student.class}</TableCell>
                    <TableCell className="text-blue-700">{student.birthDate}</TableCell>
                    <TableCell className="text-blue-700">{student.parent}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getHealthStatusVariant(student.healthStatus)}
                        className={getHealthStatusColor(student.healthStatus)}
                      >
                        {student.healthStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-blue-700">{student.allergies || "Không"}</TableCell>
                    <TableCell className="text-blue-700">{student.lastUpdate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-blue-700">
                            <Eye className="mr-2 h-4 w-4" />
                            Xem hồ sơ
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-blue-700">
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm sự kiện y tế
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getHealthStatusVariant(status: string) {
  switch (status) {
    case "Sức khỏe tốt":
      return "default"
    case "Cần theo dõi":
      return "secondary"
    case "Khẩn cấp":
      return "destructive"
    default:
      return "outline"
  }
}

function getHealthStatusColor(status: string) {
  switch (status) {
    case "Sức khỏe tốt":
      return "bg-green-100 text-green-800"
    case "Cần theo dõi":
      return "bg-yellow-100 text-yellow-800"
    case "Khẩn cấp":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const students = [
  {
    name: "Nguyễn Văn An",
    studentId: "HS2025001",
    class: "1A",
    birthDate: "15/01/2018",
    parent: "Nguyễn Thị Hương",
    healthStatus: "Sức khỏe tốt",
    allergies: "Hải sản",
    lastUpdate: "15/05/2025",
  },
  {
    name: "Trần Thị Bình",
    studentId: "HS2025002",
    class: "1A",
    birthDate: "22/03/2018",
    parent: "Trần Văn Minh",
    healthStatus: "Cần theo dõi",
    allergies: null,
    lastUpdate: "14/05/2025",
  },
  {
    name: "Lê Hoàng Cường",
    studentId: "HS2025003",
    class: "1B",
    birthDate: "08/07/2018",
    parent: "Lê Thị Mai",
    healthStatus: "Sức khỏe tốt",
    allergies: "Phấn hoa",
    lastUpdate: "13/05/2025",
  },
  {
    name: "Phạm Minh Dương",
    studentId: "HS2025004",
    class: "2A",
    birthDate: "12/11/2017",
    parent: "Phạm Thị Lan",
    healthStatus: "Sức khỏe tốt",
    allergies: null,
    lastUpdate: "12/05/2025",
  },
  {
    name: "Hoàng Thị Lan",
    studentId: "HS2025005",
    class: "2A",
    birthDate: "05/09/2017",
    parent: "Hoàng Văn Nam",
    healthStatus: "Cần theo dõi",
    allergies: "Đậu phộng",
    lastUpdate: "11/05/2025",
  },
  {
    name: "Vũ Đình Khang",
    studentId: "HS2025006",
    class: "2B",
    birthDate: "18/04/2017",
    parent: "Vũ Thị Hoa",
    healthStatus: "Sức khỏe tốt",
    allergies: null,
    lastUpdate: "10/05/2025",
  },
  {
    name: "Đỗ Thị Linh",
    studentId: "HS2025007",
    class: "3A",
    birthDate: "25/12/2016",
    parent: "Đỗ Văn Tùng",
    healthStatus: "Cần theo dõi",
    allergies: "Bụi nhà",
    lastUpdate: "09/05/2025",
  },
  {
    name: "Bùi Văn Minh",
    studentId: "HS2025008",
    class: "3A",
    birthDate: "14/06/2016",
    parent: "Bùi Thị Nga",
    healthStatus: "Sức khỏe tốt",
    allergies: null,
    lastUpdate: "08/05/2025",
  },
]

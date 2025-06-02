import { Download, Filter, Search, FileText, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/layout/sidebar/progress"

export default function ExaminationResultsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">Kết quả khám</h1>
        <p className="text-blue-600">Xem kết quả kiểm tra sức khỏe định kỳ và theo dõi sự phát triển của học sinh.</p>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-blue-50">
          <TabsTrigger value="recent" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Kết quả gần đây
          </TabsTrigger>
          <TabsTrigger value="growth" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Biểu đồ phát triển
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Lịch sử khám
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm kết quả..."
                  className="w-[300px] pl-8 border-blue-200 focus:border-blue-500"
                />
              </div>
              <Button variant="outline" size="icon" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentResults.map((result, index) => (
              <Card
                key={index}
                className="border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg text-blue-800">{result.type}</CardTitle>
                    </div>
                    <Badge
                      variant={result.status === "Bình thường" ? "default" : "secondary"}
                      className={
                        result.status === "Bình thường"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {result.status === "Bình thường" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {result.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-blue-600">Ngày khám: {result.date}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {result.measurements.map((measurement, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-700">{measurement.name}:</span>
                        <span className="text-sm text-blue-800 font-semibold">{measurement.value}</span>
                      </div>
                    ))}
                  </div>
                  {result.notes && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Ghi chú:</span> {result.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="growth" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Biểu đồ chiều cao
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Theo dõi sự phát triển chiều cao theo thời gian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {heightData.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">{data.date}</span>
                        <span className="font-medium text-blue-800">{data.height} cm</span>
                      </div>
                      <Progress value={data.percentile} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
                      <div className="text-xs text-blue-600">Phần trăm phát triển: {data.percentile}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Biểu đồ cân nặng
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Theo dõi sự phát triển cân nặng theo thời gian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weightData.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">{data.date}</span>
                        <span className="font-medium text-blue-800">{data.weight} kg</span>
                      </div>
                      <Progress value={data.percentile} className="h-2 bg-blue-100" indicatorClassName="bg-green-500" />
                      <div className="text-xs text-blue-600">Phần trăm phát triển: {data.percentile}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-4">
          <div className="rounded-md border border-blue-200">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="text-blue-800">Ngày khám</TableHead>
                  <TableHead className="text-blue-800">Loại khám</TableHead>
                  <TableHead className="text-blue-800">Bác sĩ khám</TableHead>
                  <TableHead className="text-blue-800">Kết quả</TableHead>
                  <TableHead className="text-blue-800">Ghi chú</TableHead>
                  <TableHead className="text-right text-blue-800">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examinationHistory.map((exam, index) => (
                  <TableRow key={index} className="hover:bg-blue-50 cursor-pointer">
                    <TableCell className="font-medium text-blue-800">{exam.date}</TableCell>
                    <TableCell className="text-blue-700">{exam.type}</TableCell>
                    <TableCell className="text-blue-700">{exam.doctor}</TableCell>
                    <TableCell>
                      <Badge
                        variant={exam.result === "Bình thường" ? "default" : "secondary"}
                        className={
                          exam.result === "Bình thường"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {exam.result}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-blue-700">{exam.notes}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100">
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const recentResults = [
  {
    type: "Khám sức khỏe định kỳ",
    date: "15/05/2025",
    status: "Bình thường",
    measurements: [
      { name: "Chiều cao", value: "115 cm" },
      { name: "Cân nặng", value: "22 kg" },
      { name: "BMI", value: "16.6" },
      { name: "Thị lực", value: "10/10" },
    ],
    notes: "Sức khỏe tổng quát tốt, phát triển bình thường theo độ tuổi.",
  },
  {
    type: "Khám răng miệng",
    date: "10/05/2025",
    status: "Cần theo dõi",
    measurements: [
      { name: "Răng sữa", value: "18 răng" },
      { name: "Răng vĩnh viễn", value: "2 răng" },
      { name: "Sâu răng", value: "1 răng" },
    ],
    notes: "Phát hiện 1 răng sâu nhẹ, cần điều trị sớm.",
  },
  {
    type: "Khám mắt",
    date: "05/05/2025",
    status: "Bình thường",
    measurements: [
      { name: "Thị lực mắt phải", value: "10/10" },
      { name: "Thị lực mắt trái", value: "10/10" },
      { name: "Nhãn áp", value: "Bình thư���ng" },
    ],
    notes: "Thị lực tốt, không có dấu hiệu bất thường.",
  },
]

const heightData = [
  { date: "01/2025", height: 115, percentile: 75 },
  { date: "10/2024", height: 112, percentile: 70 },
  { date: "07/2024", height: 110, percentile: 68 },
  { date: "04/2024", height: 108, percentile: 65 },
  { date: "01/2024", height: 105, percentile: 62 },
]

const weightData = [
  { date: "01/2025", weight: 22, percentile: 70 },
  { date: "10/2024", weight: 21, percentile: 68 },
  { date: "07/2024", weight: 20, percentile: 65 },
  { date: "04/2024", weight: 19, percentile: 63 },
  { date: "01/2024", weight: 18, percentile: 60 },
]

const examinationHistory = [
  {
    date: "15/05/2025",
    type: "Khám sức khỏe định kỳ",
    doctor: "BS. Nguyễn Thị Hương",
    result: "Bình thường",
    notes: "Sức khỏe tổng quát tốt, phát triển bình thường theo độ tuổi.",
  },
  {
    date: "10/05/2025",
    type: "Khám răng miệng",
    doctor: "BS. Trần Văn Minh",
    result: "Cần theo dõi",
    notes: "Phát hiện 1 răng sâu nhẹ, cần điều trị sớm.",
  },
  {
    date: "05/05/2025",
    type: "Khám mắt",
    doctor: "BS. Lê Thị Mai",
    result: "Bình thường",
    notes: "Thị lực tốt, không có dấu hiệu bất thường.",
  },
  {
    date: "01/04/2025",
    type: "Khám sức khỏe định kỳ",
    doctor: "BS. Nguyễn Thị Hương",
    result: "Bình thường",
    notes: "Phát triển tốt, cần bổ sung vitamin D.",
  },
  {
    date: "15/01/2025",
    type: "Khám tim mạch",
    doctor: "BS. Phạm Văn Đức",
    result: "Bình thường",
    notes: "Tim mạch hoạt động bình thường, nhịp tim đều.",
  },
]

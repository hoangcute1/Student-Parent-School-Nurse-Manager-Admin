import {
  Calendar,
  Download,
  Filter,
  Search,
  FileText,
  AlertTriangle,
  Clock,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MedicalHistoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Lịch sử bệnh án
        </h1>
        <p className="text-blue-600">
          Theo dõi toàn bộ lịch sử bệnh án, điều trị và chăm sóc sức khỏe của
          học sinh.
        </p>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-blue-50">
          <TabsTrigger
            value="timeline"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Dòng thời gian
          </TabsTrigger>
          <TabsTrigger
            value="chronic"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Bệnh mãn tính
          </TabsTrigger>
          <TabsTrigger
            value="allergies"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Dị ứng
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm bệnh án..."
                  className="w-[300px] pl-8 border-blue-200 focus:border-blue-500"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Xuất lịch sử
            </Button>
          </div>

          <div className="space-y-6">
            {medicalTimeline.map((entry, index) => (
              <div key={index} className="relative">
                {index !== medicalTimeline.length - 1 && (
                  <div className="absolute left-6 top-12 h-full w-0.5 bg-blue-200"></div>
                )}
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <Card className="flex-1 border-blue-100 hover:border-blue-300 transition-all duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-blue-800">
                            {entry.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 text-blue-600">
                            <Calendar className="h-4 w-4" />
                            {entry.date}
                            <span>•</span>
                            <User className="h-4 w-4" />
                            {entry.doctor}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={getSeverityVariant(entry.severity)}
                          className="ml-2"
                        >
                          {entry.severity}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-blue-700">{entry.description}</p>
                        {entry.treatment && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <h4 className="font-medium text-blue-800 mb-1">
                              Điều trị:
                            </h4>
                            <p className="text-sm text-blue-700">
                              {entry.treatment}
                            </p>
                          </div>
                        )}
                        {entry.medications && entry.medications.length > 0 && (
                          <div>
                            <h4 className="font-medium text-blue-800 mb-2">
                              Thuốc đã sử dụng:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {entry.medications.map((med, medIndex) => (
                                <Badge
                                  key={medIndex}
                                  variant="outline"
                                  className="bg-white border-blue-200 text-blue-700"
                                >
                                  {med}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {entry.followUp && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <Clock className="h-4 w-4" />
                            <span>Tái khám: {entry.followUp}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chronic" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chronicConditions.map((condition, index) => (
              <Card
                key={index}
                className="border-blue-100 hover:border-blue-300 transition-all duration-300"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-blue-800">
                      {condition.name}
                    </CardTitle>
                    <Badge
                      variant={
                        condition.status === "Đang điều trị"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        condition.status === "Đang điều trị"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {condition.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-blue-600">
                    Chẩn đoán: {condition.diagnosedDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-blue-700">{condition.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-800">
                      Thuốc hiện tại:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {condition.currentMedications.map((med, medIndex) => (
                        <Badge
                          key={medIndex}
                          variant="outline"
                          className="bg-blue-50 border-blue-200 text-blue-700"
                        >
                          {med}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <h4 className="font-medium text-blue-800 mb-1">
                      Lưu ý đặc biệt:
                    </h4>
                    <p className="text-sm text-blue-700">{condition.notes}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="allergies" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allergies.map((allergy, index) => (
              <Card
                key={index}
                className="border-red-100 hover:border-red-300 transition-all duration-300"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      {allergy.allergen}
                    </CardTitle>
                    <Badge
                      variant="destructive"
                      className="bg-red-100 text-red-800"
                    >
                      {allergy.severity}
                    </Badge>
                  </div>
                  <CardDescription className="text-red-600">
                    Phát hiện: {allergy.discoveredDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">
                      Triệu chứng:
                    </h4>
                    <p className="text-sm text-red-700">{allergy.symptoms}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">
                      Cách xử lý:
                    </h4>
                    <p className="text-sm text-red-700">{allergy.treatment}</p>
                  </div>
                  {allergy.emergencyMedication && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h4 className="font-medium text-red-800 mb-1">
                        Thuốc cấp cứu:
                      </h4>
                      <p className="text-sm text-red-700">
                        {allergy.emergencyMedication}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getSeverityVariant(severity: string) {
  switch (severity) {
    case "Nghiêm trọng":
      return "destructive";
    case "Trung bình":
      return "secondary";
    case "Nhẹ":
      return "outline";
    default:
      return "outline";
  }
}

const medicalTimeline = [
  {
    date: "15/05/2025",
    title: "Khám sức khỏe định kỳ",
    doctor: "BS. Nguyễn Thị Hương",
    severity: "Nhẹ",
    description:
      "Khám sức khỏe tổng quát định kỳ. Học sinh có sức khỏe tốt, phát triển bình thường theo độ tuổi.",
    treatment: "Không cần điều trị đặc biệt, tiếp tục theo dõi phát triển.",
    medications: [],
    followUp: "6 tháng",
  },
  {
    date: "10/05/2025",
    title: "Viêm họng cấp",
    doctor: "BS. Trần Văn Minh",
    severity: "Trung bình",
    description:
      "Học sinh bị viêm họng cấp do virus, có triệu chứng đau họng, sốt nhẹ 37.8°C.",
    treatment: "Nghỉ ngơi, uống nhiều nước, súc miệng nước muối.",
    medications: ["Paracetamol 250mg", "Vitamin C"],
    followUp: "1 tuần",
  },
  {
    date: "25/04/2025",
    title: "Dị ứng thức ăn",
    doctor: "BS. Lê Thị Mai",
    severity: "Trung bình",
    description: "Phản ứng dị ứng sau khi ăn tôm, xuất hiện mề đay và ngứa.",
    treatment: "Tránh tiếp xúc với tôm và các loại hải sản khác.",
    medications: ["Cetirizine 5mg"],
    followUp: "2 tuần",
  },
  {
    date: "15/03/2025",
    title: "Té ngã trong sân chơi",
    doctor: "Y tá Nguyễn Thị Lan",
    severity: "Nhẹ",
    description: "Học sinh té ngã khi chơi, bị trầy xước nhẹ ở đầu gối.",
    treatment: "Vệ sinh vết thương, băng bó và theo dõi.",
    medications: ["Betadine", "Băng gạc"],
    followUp: "3 ngày",
  },
];

const chronicConditions = [
  {
    name: "Hen suyễn",
    diagnosedDate: "10/01/2024",
    status: "Đang điều trị",
    description:
      "Hen suyễn nhẹ, thường xuyên tái phát khi thời tiết thay đổi hoặc tiếp xúc với bụi.",
    currentMedications: ["Salbutamol xịt", "Vitamin D"],
    notes:
      "Tránh hoạt động thể chất quá sức, luôn mang theo thuốc xịt khi cần thiết.",
  },
  {
    name: "Cận thị",
    diagnosedDate: "05/09/2024",
    status: "Đang theo dõi",
    description: "Cận thị nhẹ -0.5 độ ở cả hai mắt, có xu hướng tăng dần.",
    currentMedications: ["Vitamin A", "Lutein"],
    notes:
      "Hạn chế thời gian sử dụng thiết bị điện tử, tăng cường hoạt động ngoài trời.",
  },
];

const allergies = [
  {
    allergen: "Hải sản (Tôm, cua)",
    severity: "Trung bình",
    discoveredDate: "25/04/2025",
    symptoms: "Mề đay, ngứa, sưng môi nhẹ",
    treatment: "Tránh hoàn toàn, uống thuốc kháng histamine khi cần",
    emergencyMedication: "Cetirizine 5mg",
  },
  {
    allergen: "Phấn hoa",
    severity: "Nhẹ",
    discoveredDate: "15/03/2024",
    symptoms: "Hắt hơi, chảy nước mũi, ngứa mắt",
    treatment: "Tránh ra ngoài vào buổi sáng sớm, đeo khẩu trang",
    emergencyMedication: "Loratadine 5mg",
  },
  {
    allergen: "Bụi nhà",
    severity: "Nhẹ",
    discoveredDate: "20/01/2024",
    symptoms: "Hắt hơi, nghẹt mũi, ho khan",
    treatment: "Vệ sinh môi trường sống, sử dụng máy lọc không khí",
    emergencyMedication: null,
  },
];


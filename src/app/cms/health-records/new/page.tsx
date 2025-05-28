"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NewHealthRecordPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect would happen here after successful submission
    }, 1000)
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/health-records">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thêm hồ sơ sức khỏe mới</h1>
          <p className="text-gray-500">Khai báo thông tin sức khỏe cho học sinh</p>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="medical">Tiền sử bệnh</TabsTrigger>
          <TabsTrigger value="allergies">Dị ứng</TabsTrigger>
          <TabsTrigger value="vaccinations">Tiêm chủng</TabsTrigger>
        </TabsList>

        <form onSubmit={onSubmit}>
          <TabsContent value="basic" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Nhập thông tin cơ bản của học sinh</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Ngày sinh</Label>
                    <Input id="dob" type="date" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="class">Lớp</Label>
                    <Select>
                      <SelectTrigger id="class">
                        <SelectValue placeholder="Chọn lớp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1A">1A</SelectItem>
                        <SelectItem value="1B">1B</SelectItem>
                        <SelectItem value="2A">2A</SelectItem>
                        <SelectItem value="2B">2B</SelectItem>
                        <SelectItem value="3A">3A</SelectItem>
                        <SelectItem value="3B">3B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Giới tính</Label>
                    <RadioGroup id="gender" defaultValue="male" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Nam</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Nữ</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Chiều cao (cm)</Label>
                    <Input id="height" type="number" placeholder="120" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Cân nặng (kg)</Label>
                    <Input id="weight" type="number" placeholder="25" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Nhóm máu</Label>
                    <Select>
                      <SelectTrigger id="bloodType">
                        <SelectValue placeholder="Chọn nhóm máu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="O">O</SelectItem>
                        <SelectItem value="unknown">Không biết</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rhFactor">Yếu tố Rh</Label>
                    <Select>
                      <SelectTrigger id="rhFactor">
                        <SelectValue placeholder="Chọn yếu tố Rh" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">Dương tính (+)</SelectItem>
                        <SelectItem value="negative">Âm tính (-)</SelectItem>
                        <SelectItem value="unknown">Không biết</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentContact">Số điện thoại phụ huynh</Label>
                  <Input id="parentContact" placeholder="0912345678" required />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button">
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={() => document.querySelector('[value="medical"]')?.dispatchEvent(new MouseEvent("click"))}
                >
                  Tiếp theo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tiền sử bệnh</CardTitle>
                <CardDescription>Thông tin về tiền sử bệnh và tình trạng sức khỏe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chronicDiseases">Bệnh mãn tính</Label>
                  <Select>
                    <SelectTrigger id="chronicDiseases">
                      <SelectValue placeholder="Chọn bệnh mãn tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không có</SelectItem>
                      <SelectItem value="asthma">Hen suyễn</SelectItem>
                      <SelectItem value="diabetes">Tiểu đường</SelectItem>
                      <SelectItem value="epilepsy">Động kinh</SelectItem>
                      <SelectItem value="heart">Bệnh tim</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chronicDetails">Chi tiết bệnh mãn tính</Label>
                  <Textarea id="chronicDetails" placeholder="Mô tả chi tiết về bệnh mãn tính (nếu có)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medications">Thuốc đang sử dụng</Label>
                  <Textarea id="medications" placeholder="Liệt kê các loại thuốc đang sử dụng (nếu có)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vision">Thị lực</Label>
                  <Select>
                    <SelectTrigger id="vision">
                      <SelectValue placeholder="Chọn tình trạng thị lực" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Bình thường</SelectItem>
                      <SelectItem value="myopia">Cận thị</SelectItem>
                      <SelectItem value="hyperopia">Viễn thị</SelectItem>
                      <SelectItem value="astigmatism">Loạn thị</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hearing">Thính lực</Label>
                  <Select>
                    <SelectTrigger id="hearing">
                      <SelectValue placeholder="Chọn tình trạng thính lực" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Bình thường</SelectItem>
                      <SelectItem value="mild">Giảm nhẹ</SelectItem>
                      <SelectItem value="moderate">Giảm trung bình</SelectItem>
                      <SelectItem value="severe">Giảm nặng</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pastSurgeries">Tiền sử phẫu thuật</Label>
                  <Textarea id="pastSurgeries" placeholder="Mô tả các phẫu thuật đã trải qua (nếu có)" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => document.querySelector('[value="basic"]')?.dispatchEvent(new MouseEvent("click"))}
                >
                  Quay lại
                </Button>
                <Button
                  type="button"
                  onClick={() => document.querySelector('[value="allergies"]')?.dispatchEvent(new MouseEvent("click"))}
                >
                  Tiếp theo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="allergies" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Dị ứng</CardTitle>
                <CardDescription>Thông tin về các loại dị ứng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Dị ứng thực phẩm</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Hải sản", "Đậu phộng", "Trứng", "Sữa", "Gluten", "Đậu nành"].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input type="checkbox" id={`food-${index}`} className="h-4 w-4 rounded border-gray-300" />
                        <Label htmlFor={`food-${index}`}>{item}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <Input placeholder="Dị ứng thực phẩm khác..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Dị ứng thuốc</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Penicillin", "Aspirin", "Ibuprofen", "Sulfa"].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input type="checkbox" id={`med-${index}`} className="h-4 w-4 rounded border-gray-300" />
                        <Label htmlFor={`med-${index}`}>{item}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <Input placeholder="Dị ứng thuốc khác..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Dị ứng khác</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Phấn hoa", "Nọc ong", "Bụi nhà", "Lông thú", "Mủ cao su"].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input type="checkbox" id={`other-${index}`} className="h-4 w-4 rounded border-gray-300" />
                        <Label htmlFor={`other-${index}`}>{item}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <Input placeholder="Dị ứng khác..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergyDetails">Chi tiết về dị ứng</Label>
                  <Textarea id="allergyDetails" placeholder="Mô tả chi tiết về các dị ứng, biểu hiện và cách xử lý" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyMedication">Thuốc cấp cứu khi dị ứng</Label>
                  <Input id="emergencyMedication" placeholder="Ví dụ: EpiPen, Antihistamine..." />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => document.querySelector('[value="medical"]')?.dispatchEvent(new MouseEvent("click"))}
                >
                  Quay lại
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    document.querySelector('[value="vaccinations"]')?.dispatchEvent(new MouseEvent("click"))
                  }
                >
                  Tiếp theo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="vaccinations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tiêm chủng</CardTitle>
                <CardDescription>Thông tin về lịch sử tiêm chủng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    { name: "BCG (Lao)", id: "bcg" },
                    { name: "Viêm gan B", id: "hepb" },
                    { name: "Bạch hầu - Ho gà - Uốn ván (DPT)", id: "dpt" },
                    { name: "Bại liệt (OPV/IPV)", id: "polio" },
                    { name: "Sởi - Quai bị - Rubella (MMR)", id: "mmr" },
                    { name: "Viêm não Nhật Bản", id: "je" },
                    { name: "Thủy đậu", id: "varicella" },
                    { name: "Cúm", id: "flu" },
                  ].map((vaccine) => (
                    <div key={vaccine.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={vaccine.id} className="text-base font-medium">
                          {vaccine.name}
                        </Label>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id={vaccine.id} className="h-4 w-4 rounded border-gray-300" />
                          <Label htmlFor={vaccine.id}>Đã tiêm</Label>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="space-y-2">
                          <Label htmlFor={`${vaccine.id}-date`}>Ngày tiêm</Label>
                          <Input id={`${vaccine.id}-date`} type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${vaccine.id}-location`}>Nơi tiêm</Label>
                          <Input id={`${vaccine.id}-location`} placeholder="Ví dụ: Trung tâm Y tế..." />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherVaccines">Vắc-xin khác</Label>
                  <Textarea id="otherVaccines" placeholder="Liệt kê các loại vắc-xin khác đã tiêm (nếu có)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vaccineReactions">Phản ứng sau tiêm</Label>
                  <Textarea id="vaccineReactions" placeholder="Mô tả các phản ứng sau tiêm (nếu có)" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => document.querySelector('[value="allergies"]')?.dispatchEvent(new MouseEvent("click"))}
                >
                  Quay lại
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Đang lưu..." : "Lưu hồ sơ"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  )
}

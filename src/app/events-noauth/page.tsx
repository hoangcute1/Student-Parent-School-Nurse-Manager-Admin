"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Search, Filter, Eye, Edit, Trash2, AlertTriangle, Clock, CheckCircle } from "lucide-react";

// Mock data for testing
const mockStudents = [
  { id: "1", name: "Nguyễn Văn A", class: "10A1", email: "a@example.com" },
  { id: "2", name: "Trần Thị B", class: "10A2", email: "b@example.com" },
  { id: "3", name: "Lê Văn C", class: "11B1", email: "c@example.com" },
];

const mockActiveEvents = [
  {
    id: "1",
    studentName: "Nguyễn Văn A",
    studentClass: "10A1",
    eventType: "Đau bụng",
    priority: "Cao",
    status: "Đang xử lý",
    createdAt: "2024-01-15T10:30:00Z",
    description: "Học sinh phàn nàn đau bụng sau giờ ăn trưa"
  },
  {
    id: "2",
    studentName: "Trần Thị B",
    studentClass: "10A2",
    eventType: "Sốt",
    priority: "Trung bình",
    status: "Chờ xử lý",
    createdAt: "2024-01-15T11:00:00Z",
    description: "Học sinh có triệu chứng sốt nhẹ"
  }
];

export default function EventsNoAuthPage() {
  const [students, setStudents] = useState(mockStudents);
  const [activeEvents, setActiveEvents] = useState(mockActiveEvents);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [eventType, setEventType] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddEvent = () => {
    if (!selectedStudent || !eventType || !priority || !description) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const student = students.find(s => s.id === selectedStudent);
    if (!student) {
      toast.error("Không tìm thấy học sinh");
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      studentName: student.name,
      studentClass: student.class,
      eventType,
      priority,
      status: "Chờ xử lý",
      createdAt: new Date().toISOString(),
      description
    };

    setActiveEvents([...activeEvents, newEvent]);
    toast.success("Đã thêm sự cố y tế mới");
    
    // Reset form
    setSelectedStudent("");
    setEventType("");
    setPriority("");
    setDescription("");
    setIsAddDialogOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Cao": return "bg-red-100 text-red-800";
      case "Trung bình": return "bg-yellow-100 text-yellow-800";
      case "Thấp": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang xử lý": return "bg-blue-100 text-blue-800";
      case "Chờ xử lý": return "bg-orange-100 text-orange-800";
      case "Hoàn thành": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý sự cố y tế</h1>
          <p className="text-gray-600 mt-2">Theo dõi và xử lý các sự cố y tế của học sinh</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Thêm sự cố mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm sự cố y tế mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="student">Học sinh</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn học sinh" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} - {student.class}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="eventType">Loại sự cố</Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại sự cố" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đau bụng">Đau bụng</SelectItem>
                    <SelectItem value="Sốt">Sốt</SelectItem>
                    <SelectItem value="Đau đầu">Đau đầu</SelectItem>
                    <SelectItem value="Chấn thương">Chấn thương</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority">Mức độ ưu tiên</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cao">Cao</SelectItem>
                    <SelectItem value="Trung bình">Trung bình</SelectItem>
                    <SelectItem value="Thấp">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả chi tiết về sự cố..."
                  rows={3}
                />
              </div>
              
              <Button onClick={handleAddEvent} className="w-full">
                Thêm sự cố
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Sự cố đang xử lý ({activeEvents.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Đã hoàn thành (0)
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Khẩn cấp (0)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.studentName}</CardTitle>
                      <p className="text-sm text-gray-600">{event.studentClass}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(event.priority)}>
                        {event.priority}
                      </Badge>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Loại sự cố:</span>
                      <span>{event.eventType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Thời gian:</span>
                      <span>{new Date(event.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Mô tả:</span>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Xem chi tiết
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Cập nhật
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Chưa có sự cố nào được hoàn thành</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency">
          <Card>
            <CardContent className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Không có sự cố khẩn cấp nào</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

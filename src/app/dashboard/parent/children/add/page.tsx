"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addChild } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Child } from "@/lib/models";
import { useToast } from "@/components/ui/use-toast";

export default function AddChildPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "male" as "male" | "female",
    grade: "1",
    class: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectChange = (name: string, value: string) => {
    if (name === "gender") {
      // Ensure gender is typed correctly
      setFormData((prev) => ({
        ...prev,
        [name]: value as "male" | "female",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Lỗi xác thực",
        description: "Bạn cần đăng nhập để thực hiện thao tác này",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsSubmitting(true);

      // Create properly typed child data
      const childData: Omit<Child, "id"> = {
        name: formData.name,
        dob: formData.dob,
        gender: formData.gender, // This is now correctly typed
        grade: formData.grade,
        class: formData.class,
        parentId: user.id,
      };

      const result = await addChild(childData);

      toast({
        title: "Thành công",
        description: "Đã thêm học sinh thành công",
      });

      router.push("/dashboard/parent/children");
    } catch (error) {
      console.error("Error adding child:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm học sinh. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate class options based on grade
  const getClassOptions = (grade: string) => {
    const classNames = ["A", "B", "C", "D", "E"];
    return classNames.map((className) => `${grade}${className}`);
  };

  const classOptions = getClassOptions(formData.grade);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Thêm học sinh mới</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin học sinh</CardTitle>
          <CardDescription>Nhập thông tin chi tiết về học sinh</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Họ và tên học sinh"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">
                  Ngày sinh <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Giới tính <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="gender-male" />
                    <Label htmlFor="gender-male">Nam</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="gender-female" />
                    <Label htmlFor="gender-female">Nữ</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">
                    Khối lớp <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) =>
                      handleSelectChange("grade", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khối lớp" />
                    </SelectTrigger>
                    <SelectContent>
                      {["1", "2", "3", "4", "5"].map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          Khối {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">
                    Lớp <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.class}
                    onValueChange={(value) =>
                      handleSelectChange("class", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lớp" />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "Thêm học sinh"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

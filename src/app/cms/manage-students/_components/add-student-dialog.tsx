"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { User as AppUser } from "@/lib/type/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const studentFormSchema = z.object({
  name: z.string().min(1, { message: "Họ và tên không được để trống" }),
  studentId: z.string().min(1, { message: "Mã học sinh không được để trống" }),
  birth: z.string().min(1, { message: "Ngày sinh không được để trống" }),
  gender: z.enum(["male", "female"], {
    required_error: "Vui lòng chọn giới tính",
  }),
  grade: z.string().min(1, { message: "Vui lòng chọn khối" }),
  class: z.string().min(1, { message: "Vui lòng chọn lớp" }),
  parentId: z.string().optional(),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;

interface AddStudentDialogProps {
  onSubmit: (data: StudentFormValues) => Promise<void>;
}

export function AddStudentDialog({ onSubmit }: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const authData = localStorage.getItem("authData");
    if (!authData) return;

    try {
      const data = JSON.parse(authData);
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error parsing auth data:", error);
    }
  }, []);
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      studentId: "",
      birth: "",
      gender: "male",
      grade: "",
      class: "",
      parentId: "",
    },
  });

  const handleSubmit = async (data: StudentFormValues) => {
    try {
      await onSubmit(data);
      setOpen(false);
      form.reset();
    } catch (err: any) {
      console.error("Failed to submit form:", err);
      // Set form error
      form.setError("root", {
        type: "serverError",
        message: err.message || "Failed to create student",
      });
    }
  };

  return (
    user?.role == "admin" && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="ml-2 h-4 w-4" />
            Thêm học sinh
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm học sinh mới</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã học sinh</FormLabel>
                    <FormControl>
                      <Input placeholder="SV001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khối</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn khối" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="10">Khối 10</SelectItem>
                        <SelectItem value="11">Khối 11</SelectItem>
                        <SelectItem value="12">Khối 12</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lớp</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn lớp" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {form.watch("grade") === "10" && (
                          <>
                            <SelectItem value="10A1">10A1</SelectItem>
                            <SelectItem value="10A2">10A2</SelectItem>
                            <SelectItem value="10A3">10A3</SelectItem>
                          </>
                        )}
                        {form.watch("grade") === "11" && (
                          <>
                            <SelectItem value="11A1">11A1</SelectItem>
                            <SelectItem value="11A2">11A2</SelectItem>
                            <SelectItem value="11A3">11A3</SelectItem>
                          </>
                        )}
                        {form.watch("grade") === "12" && (
                          <>
                            <SelectItem value="12A1">12A1</SelectItem>
                            <SelectItem value="12A2">12A2</SelectItem>
                            <SelectItem value="12A3">12A3</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>ID phụ huynh (không bắt buộc)</FormLabel>
                    <FormControl>
                      <Input placeholder="Để trống nếu chưa có" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Lưu</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  );
}

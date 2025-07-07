"use client";

import { useEffect } from "react";
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
import { useClassStore } from "@/stores/class-store";
import { useAuthStore } from "@/stores/auth-store";
import type { User as AppUser } from "@/lib/type/users";
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
  birth: z
    .string()
    .min(1, { message: "Ngày sinh không được để trống" })
    .refine((val) => !isNaN(Date.parse(val)), { message: "Ngày sinh không hợp lệ" })
    .refine((val) => new Date(val) <= new Date(), { message: "Ngày sinh không được là ngày trong tương lai" }),
  gender: z.enum(["male", "female"], { required_error: "Vui lòng chọn giới tính" }),
  classId: z.string().min(1, { message: "Vui lòng chọn lớp" }),
  parentId: z.string().optional(),
});

export type UpdateStudentFormValues = z.infer<typeof studentFormSchema>;

interface UpdateStudentDialogProps {
  onSubmit: (data: UpdateStudentFormValues) => Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultValues?: UpdateStudentFormValues;
  trigger?: React.ReactNode;
}

export function UpdateStudentDialog({
  onSubmit,
  open = false,
  onOpenChange,
  defaultValues,
  trigger,
}: UpdateStudentDialogProps) {
  const { classes } = useClassStore();
  const { user } = useAuthStore();
  const form = useForm<UpdateStudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: defaultValues || {
      name: "",
      studentId: "",
      birth: "",
      gender: "male",
      classId: "",
      parentId: "",
    },
  });

  const handleSubmit = async (data: UpdateStudentFormValues) => {
    try {
      await onSubmit(data);
      if (onOpenChange) onOpenChange(false);
      form.reset(defaultValues || {});
    } catch (err: any) {
      console.error("Failed to update student:", err);
      form.setError("root", {
        type: "serverError",
        message: err.message || "Không thể cập nhật học sinh",
      });
    }
  };

  const defaultTrigger = user?.role === "admin" && (
    <DialogTrigger asChild>
      <Button variant="outline" className="ml-2">
        Chỉnh sửa
      </Button>
    </DialogTrigger>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger || defaultTrigger}
      <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin học sinh</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin học sinh hiện tại.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyen Van A" {...field} />
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID lớp</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập ID phụ huynh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID phụ huynh (không bắt buộc)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập ID phụ huynh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Cập nhật</Button>
            </DialogFooter>
            {form.formState.errors.root && (
              <p className="text-red-500 text-sm">{form.formState.errors.root.message}</p>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
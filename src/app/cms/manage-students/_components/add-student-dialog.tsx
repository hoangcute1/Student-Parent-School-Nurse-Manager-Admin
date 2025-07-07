"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClassStore } from "@/stores/class-store";
import {
  User,
  Calendar,
  Mail,
  Users,
  IdCard,
  UserCheck,
  Plus,
  School,
} from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Tên là bắt buộc"),
  studentId: z.string().min(1, "Mã học sinh là bắt buộc"),
  birth: z.string().min(1, "Ngày sinh là bắt buộc"),
  gender: z.enum(["male", "female"]),
  class: z.string().min(1, "Lớp là bắt buộc"),
  parentEmail: z.string().optional(),
});

export type AddStudentFormValues = z.infer<typeof formSchema>;

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddStudentFormValues) => Promise<void>;
  trigger?: React.ReactNode;
  defaultValues?: AddStudentFormValues;
}

export function AddStudentDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  trigger,
}: AddStudentDialogProps) {
  const { classes } = useClassStore();

  const form = useForm<AddStudentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      studentId: "",
      birth: "",
      gender: "male",
      class: "",
      parentEmail: "",
    },
  });

  const handleSubmit = async (data: AddStudentFormValues) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
        <DialogHeader className="pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-sky-800 bg-clip-text text-transparent">
                Thêm học sinh mới
              </DialogTitle>
              <p className="text-gray-600 text-sm mt-1">
                Nhập thông tin chi tiết để thêm học sinh vào hệ thống
              </p>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 px-1"
          >
            {/* Thông tin cơ bản */}
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-sky-600" />
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-sky-600" />
                        Họ và tên
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border-sky-200 focus:border-sky-500 focus:ring-sky-500/20 h-12 rounded-xl"
                          placeholder="Nhập họ và tên học sinh"
                        />
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
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <IdCard className="w-4 h-4 text-sky-600" />
                        Mã học sinh
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border-sky-200 focus:border-sky-500 focus:ring-sky-500/20 h-12 rounded-xl"
                          placeholder="Ví dụ: HS001"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Thông tin cá nhân */}
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-600" />
                Thông tin cá nhân
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-sky-600" />
                        Ngày sinh
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="border-sky-200 focus:border-sky-500 focus:ring-sky-500/20 h-12 rounded-xl"
                        />
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
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-sky-600" />
                        Giới tính
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="border-sky-200 focus:border-sky-500 focus:ring-sky-500/20 h-12 rounded-xl">
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Nam</SelectItem>
                            <SelectItem value="female">Nữ</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Thông tin lớp học */}
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <School className="w-5 h-5 text-sky-600" />
                Thông tin học tập
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <Users className="w-4 h-4 text-sky-600" />
                        ID lớp
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border-sky-200 focus:border-sky-500 focus:ring-sky-500/20 h-12 rounded-xl"
                          placeholder="Nhập ID lớp học"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-sky-600" />
                        Email phụ huynh
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="border-sky-200 focus:border-sky-500 focus:ring-sky-500/20 h-12 rounded-xl"
                          placeholder="phu.huynh@email.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-12 rounded-xl"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg h-12 rounded-xl"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Đang lưu...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Thêm học sinh
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

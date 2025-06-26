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
      <DialogContent>
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
                  <FormLabel>Tên học sinh</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
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
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
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
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID lớp</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Email phụ huynh</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Đang lưu..." : "Thêm học sinh"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
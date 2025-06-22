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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { User as AppUser } from "@/lib/type/users";

const medicationFormSchema = z.object({
  name: z.string().min(1, { message: "Tên thuốc không được để trống" }),
  dosage: z.string().min(1, { message: "Liều lượng không được để trống" }),
  unit: z.coerce.number().min(1, { message: "Đơn vị tính phải lớn hơn 0" }),
  type: z.string().min(1, { message: "Loại thuốc không được để trống" }),
  usage_instructions: z
    .string()
    .min(1, { message: "Hướng dẫn sử dụng không được để trống" }),
  side_effects: z.string().optional(),
  contraindications: z.string().optional(),
  description: z.string().optional(),
});

export type MedicationFormValues = z.infer<typeof medicationFormSchema>;

interface AuthUser {
  email: string;
  role: string;
}

interface AddMedicationDialogProps {
  onSubmit: (data: MedicationFormValues) => Promise<void>;
}

export function AddMedicationDialog({ onSubmit }: AddMedicationDialogProps) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const { toast } = useToast();

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

  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: {
      name: "",
      dosage: "",
      unit: 1,
      type: "",
      usage_instructions: "",
      side_effects: "",
      contraindications: "",
      description: "",
    },
  });

  const handleSubmit = async (data: MedicationFormValues) => {
    try {
      await onSubmit(data);
      setOpen(false);
      form.reset();
      toast({
        title: "Thành công",
        description: "Đã thêm thuốc mới vào hệ thống",
        variant: "default",
      });
    } catch (err: any) {
      console.error("Failed to submit form:", err);
      // Set form error
      form.setError("root", {
        type: "serverError",
        message: err.message || "Không thể thêm thuốc, vui lòng thử lại",
      });
      toast({
        title: "Lỗi",
        description: err.message || "Không thể thêm thuốc, vui lòng thử lại",
        variant: "destructive",
      });
    }
  };

  return (
    user?.role === "admin" && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Thêm thuốc
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm thuốc mới</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {form.formState.errors.root && (
                <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
                  {form.formState.errors.root.message}
                </div>
              )}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên thuốc</FormLabel>
                    <FormControl>
                      <Input placeholder="Paracetamol" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại thuốc</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại thuốc" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Kháng sinh">Kháng sinh</SelectItem>
                        <SelectItem value="Giảm đau">Giảm đau</SelectItem>
                        <SelectItem value="Hạ sốt">Hạ sốt</SelectItem>
                        <SelectItem value="Vitamin">Vitamin</SelectItem>
                        <SelectItem value="Kháng dị ứng">
                          Kháng dị ứng
                        </SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Liều lượng</FormLabel>
                      <FormControl>
                        <Input placeholder="500mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng đóng gói</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="usage_instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hướng dẫn sử dụng</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả cách sử dụng thuốc..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="side_effects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tác dụng phụ</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Các tác dụng phụ có thể gặp..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contraindications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chống chỉ định</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Các trường hợp không nên dùng thuốc..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả thêm</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Thông tin bổ sung về thuốc..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Lưu
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  );
}

import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Form, useForm } from "react-hook-form";
import * as z from "zod";
import type { User as AppUser } from "@/lib/type/types";
import { Button } from "@/components/ui/button";

const staffFormSchema = z.object({
  name: z.string().min(1, { message: "Họ và tên không được để trống" }),
  phone: z.string().min(1, { message: "Số điện thoại không được để trống" }),
  address: z.string().min(1, { message: "Địa chỉ không được để trống" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;

interface AddStaffDialogProps {
  onSubmit: (data: StaffFormValues) => Promise<void>;
}
export function AddStaffDialog({ onSubmit }: AddStaffDialogProps) {
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

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      email: "",
    },
  });

  const handleSubmit = async (data: StaffFormValues) => {
    try {
      await onSubmit(data);
      setOpen(false);
      form.reset();
    } catch (err: any) {
      console.error("Failed to submit form:", err);
      // Set form error
      form.setError("root", {
        type: "serverError",
        message: err.message || "Failed to create staff",
      });
    }
  };

  return (
    user?.userType == "admin" && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="btn btn-primary" onClick={() => setOpen(true)}>
            Thêm nhân viên
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm phụ huynh mới</DialogTitle>
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="0123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Đường ABC, Quận 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
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

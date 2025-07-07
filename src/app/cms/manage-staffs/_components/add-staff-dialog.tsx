"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export interface StaffFormValues {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  gender?: string;
}

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StaffFormValues) => void;
  onCancel: () => void;
}

export function AddStaffDialog({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
}: AddStaffDialogProps) {
  const [form, setForm] = useState<StaffFormValues>({
    email: "",
    password: "password123",
    name: "",
    phone: "",
    address: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // Không cho phép thay đổi password
    if (e.target.name === "password") return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email.trim() || !form.password.trim() || !form.name.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone,
        address: form.address,
        gender: form.gender,
      });
      toast({
        title: "Thành công",
        description: "Đã thêm nhân viên mới vào hệ thống",
        variant: "default",
      });
      onOpenChange(false);
    } catch (err: any) {
      console.error("Failed to submit form:", err);
      setError(err.message || "Không thể thêm nhân viên, vui lòng thử lại");
      toast({
        title: "Lỗi",
        description:
          err.message || "Không thể thêm nhân viên, vui lòng thử lại",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sky-700">
            Thêm nhân viên mới
          </DialogTitle>
        </DialogHeader>
        <form
          id="add-staff-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 py-2"
        >
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
            required
            readOnly
          />
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Họ và tên"
            required
          />
          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
          />
          <Input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Địa chỉ"
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </form>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            type="button"
            disabled={loading}
          >
            Huỷ
          </Button>
          <Button
            type="submit"
            form="add-staff-form"
            disabled={loading}
            className="text-white bg-sky-600 hover:bg-sky-600"
          >
            {loading ? "Đang thêm..." : "Thêm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

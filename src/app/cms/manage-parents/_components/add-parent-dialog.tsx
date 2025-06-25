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

export interface ParentFormValues {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  gender?: string;
}

interface AddParentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ParentFormValues) => void;
  onCancel: () => void;
}

export function AddParentDialog({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
}: AddParentDialogProps) {
  const [form, setForm] = useState<ParentFormValues>({
    email: "",
    password: "",
    name: "",
    phone: "",
    address: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        description: "Đã thêm phụ huynh mới vào hệ thống",
        variant: "default",
      });
      onOpenChange(false);
    } catch (err: any) {
      console.error("Failed to submit form:", err);
      setError(err.message || "Không thể thêm phụ huynh, vui lòng thử lại");
      toast({
        title: "Lỗi",
        description:
          err.message || "Không thể thêm phụ huynh, vui lòng thử lại",
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
          <DialogTitle>Thêm phụ huynh mới</DialogTitle>
        </DialogHeader>
        <form
          id="add-parent-form"
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
            type="password"
            required
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
          <Input
            name="gender"
            value={form.gender}
            onChange={handleChange}
            placeholder="Giới tính"
          />
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
          <Button type="submit" form="add-parent-form" disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

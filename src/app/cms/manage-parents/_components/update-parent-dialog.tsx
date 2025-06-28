import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Parent } from "@/lib/type/parents";
import { updateProfileByUserId } from "@/lib/api/profile";
import { useToast } from "@/hooks/use-toast";

interface UpdateParentDialogProps {
  parent: Parent;
  onClose: () => void;
  onSubmit?: (updated: Parent) => void;
}

export function UpdateParentDialog({
  parent,
  onClose,
  onSubmit,
}: UpdateParentDialogProps) {
  const getToday = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return getToday();
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return getToday();
    return d.toISOString().slice(0, 10);
  };
  // Đảm bảo profile và user luôn là object
  const [form, setForm] = useState({
    ...parent,
    profile: {
      ...parent.profile,
      name: parent.profile?.name || "",
      phone: parent.profile?.phone || "",
      address: parent.profile?.address || "",
      gender: parent.profile?.gender || "",
      birth: formatDate(parent.profile?.birth),
      avatar: parent.profile?.avatar || "",
    },
    user: parent.user || { email: "" },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      profile: { ...prev.profile, [name]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.profile.name.trim()) {
      setError("Vui lòng nhập họ tên");
      return;
    }
    if (!form.profile.phone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await updateProfileByUserId(form.user._id, {
        name: form.profile.name,
        gender: form.profile.gender,
        birth: form.profile.birth,
        address: form.profile.address,
        avatar: form.profile.avatar,
        phone: form.profile.phone,
      });
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin phụ huynh.",
        variant: "default",
      });
      onSubmit?.(form);
      onClose();
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật phụ huynh");
      toast({
        title: "Lỗi",
        description: err.message || "Không thể cập nhật phụ huynh",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa phụ huynh</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          <Input
            name="name"
            value={form.profile.name}
            onChange={handleChange}
            placeholder="Họ và tên"
            required
          />
          <select
            name="gender"
            value={form.profile.gender || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
          <Input
            name="birth"
            value={form.profile.birth || ""}
            onChange={handleChange}
            placeholder="Ngày sinh (YYYY-MM-DD)"
            type="date"
          />
          <Input
            name="phone"
            value={form.profile.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
            required
          />
          <Input
            name="address"
            value={form.profile.address}
            onChange={handleChange}
            placeholder="Địa chỉ"
          />
          <Input
            name="avatar"
            value={form.profile.avatar || ""}
            onChange={handleChange}
            placeholder="Link ảnh đại diện"
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Huỷ
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

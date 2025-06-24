import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MedicationFormProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export const MedicationFormDialog: React.FC<MedicationFormProps> = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    type: "",
    dosage: "",
    unit: "",
    usage_instructions: "",
    side_effects: "",
    contraindications: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Thêm thuốc mới</DialogTitle>
        <DialogDescription>Nhập thông tin thuốc mới vào các trường bên dưới.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Tên thuốc" value={form.name} onChange={handleChange} className="w-full border rounded p-2" required />
        <input name="type" placeholder="Loại thuốc" value={form.type} onChange={handleChange} className="w-full border rounded p-2" required />
        <input name="dosage" placeholder="Liều lượng" value={form.dosage} onChange={handleChange} className="w-full border rounded p-2" />
        <input name="unit" placeholder="Đơn vị" value={form.unit} onChange={handleChange} className="w-full border rounded p-2" />
        <textarea name="usage_instructions" placeholder="Hướng dẫn sử dụng" value={form.usage_instructions} onChange={handleChange} className="w-full border rounded p-2" />
        <textarea name="side_effects" placeholder="Tác dụng phụ" value={form.side_effects} onChange={handleChange} className="w-full border rounded p-2" />
        <textarea name="contraindications" placeholder="Chống chỉ định" value={form.contraindications} onChange={handleChange} className="w-full border rounded p-2" />
        <textarea name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} className="w-full border rounded p-2" />
        <DialogFooter>
          <Button type="submit">Thêm</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onCancel}>Hủy</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

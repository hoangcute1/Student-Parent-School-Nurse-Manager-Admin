import React, { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MedicationFormProps {
  defaultValues?: {
    name?: string;
    type?: string;
    dosage?: string;
    unit?: string;
    usage_instructions?: string;
    side_effects?: string;
    contraindications?: string;
    description?: string;
    manufacturer?: string;
    quantity?: number | string;
    is_prescription_required?: boolean;
  };
  isEdit?: boolean;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export const MedicationFormDialog: React.FC<MedicationFormProps> = ({
  onSubmit,
  onCancel,
  isEdit = false,
  defaultValues,
}) => {
  const [form, setForm] = useState({
    name: "",
    type: "",
    dosage: "",
    unit: "",
    usage_instructions: "",
    side_effects: "",
    contraindications: "",
    description: "",
    quantity: "",
    is_prescription_required: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && defaultValues) {
      setForm({
        name: defaultValues.name || "",
        type: defaultValues.type || "",
        dosage: defaultValues.dosage || "",
        unit: defaultValues.unit || "",
        usage_instructions: defaultValues.usage_instructions || "",
        side_effects: defaultValues.side_effects || "",
        contraindications: defaultValues.contraindications || "",
        description: defaultValues.description || "",
        quantity:
          defaultValues.quantity !== undefined &&
          defaultValues.quantity !== null
            ? String(defaultValues.quantity)
            : "",
        is_prescription_required: !!defaultValues.is_prescription_required,
      });
    } else if (!isEdit) {
      setForm({
        name: "",
        type: "",
        dosage: "",
        unit: "",
        usage_instructions: "",
        side_effects: "",
        contraindications: "",
        description: "",
        quantity: "",
        is_prescription_required: false,
      });
    }
  }, [isEdit, defaultValues]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const submitData = {
      ...form,
      quantity: form.quantity ? Number(form.quantity) : undefined,
      is_prescription_required: !!form.is_prescription_required,
    };
    await onSubmit(submitData);
    setLoading(false);
  };

  return (
    <DialogContent className="max-w-2xl bg-white rounded-2xl shadow-xl p-0">
      <DialogHeader className="px-6 pt-6">
        <DialogTitle className="text-2xl font-bold text-sky-800">
          {isEdit ? "Chỉnh sửa thông tin thuốc" : "Thêm thuốc mới"}
        </DialogTitle>
        <DialogDescription className="text-gray-500">
          {isEdit
            ? "Cập nhật thông tin thuốc bên dưới."
            : "Nhập thông tin thuốc mới vào các trường bên dưới."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block font-semibold text-sky-700 mb-1"
            >
              Tên thuốc *
            </label>
            <input
              id="name"
              name="name"
              placeholder="Tên thuốc"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-sky-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-sky-500 shadow-sm transition-all outline-none"
              required
              list="medication-name-list"
            />
            <datalist id="medication-name-list">
              <option value="Paracetamol" />
              <option value="Ibuprofen" />
              <option value="Amoxicillin" />
              <option value="Vitamin C" />
              <option value="Cefixime" />
              <option value="Loratadine" />
              <option value="Omeprazole" />
              <option value="Acetaminophen" />
            </datalist>
          </div>
          <div>
            <label
              htmlFor="type"
              className="block font-semibold text-sky-700 mb-1"
            >
              Loại thuốc *
            </label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-sky-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-400 focus:border-sky-500 shadow-sm transition-all outline-none"
              required
            >
              <option value="">-- Chọn loại thuốc --</option>
              <option value="analgesic">Giảm đau (analgesic)</option>
              <option value="antibiotic">Kháng sinh (antibiotic)</option>
              <option value="antihistamine">
                Chống dị ứng (antihistamine)
              </option>
              <option value="antiviral">Kháng virus (antiviral)</option>
              <option value="antihypertensive">
                Hạ huyết áp (antihypertensive)
              </option>
              <option value="antidepressant">
                Chống trầm cảm (antidepressant)
              </option>
              <option value="anti-inflammatory">
                Chống viêm (anti-inflammatory)
              </option>
              <option value="antifungal">Kháng nấm (antifungal)</option>
              <option value="antiseptic">Sát khuẩn (antiseptic)</option>
              <option value="vitamin">Vitamin</option>
              <option value="other">Khác (other)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="dosage"
              className="block font-semibold text-sky-700 mb-1"
            >
              Liều lượng
            </label>
            <input
              id="dosage"
              name="dosage"
              placeholder="Liều lượng"
              value={form.dosage}
              onChange={handleChange}
              className="w-full border border-sky-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-sky-500 shadow-sm transition-all outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="unit"
              className="block font-semibold text-sky-700 mb-1"
            >
              Đơn vị
            </label>
            <select
              id="unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full border border-sky-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-400 focus:border-sky-500 shadow-sm transition-all outline-none"
              required
            >
              <option value="">-- Chọn đơn vị --</option>
              <option value="tablet">Viên nén (tablet)</option>
              <option value="capsule">Viên nang (capsule)</option>
              <option value="liquid">Dung dịch (liquid)</option>
              <option value="injection">Tiêm (injection)</option>
              <option value="cream">Kem bôi (cream)</option>
              <option value="drops">Nhỏ (drops)</option>
              <option value="inhaler">Hít (inhaler)</option>
              <option value="other">Khác (other)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="block font-semibold text-sky-700 mb-1"
            >
              Số lượng
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              placeholder="Số lượng"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border border-sky-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-sky-500 shadow-sm transition-all outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="usage_instructions"
              className="block font-semibold text-sky-700 mb-1"
            >
              Hướng dẫn sử dụng
            </label>
            <textarea
              id="usage_instructions"
              name="usage_instructions"
              placeholder="Hướng dẫn sử dụng"
              value={form.usage_instructions}
              onChange={handleChange}
              className="w-full border border-sky-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-sky-500 shadow-sm min-h-[60px] transition-all outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="side_effects"
              className="block font-semibold text-sky-700 mb-1"
            >
              Tác dụng phụ
            </label>
            <textarea
              id="side_effects"
              name="side_effects"
              placeholder="Tác dụng phụ"
              value={form.side_effects}
              onChange={handleChange}
              className="w-full border border-sky-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-sky-500 shadow-sm min-h-[60px] transition-all outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="contraindications"
              className="block font-semibold text-sky-700 mb-1"
            >
              Chống chỉ định
            </label>
            <textarea
              id="contraindications"
              name="contraindications"
              placeholder="Chống chỉ định"
              value={form.contraindications}
              onChange={handleChange}
              className="w-full border border-sky-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-sky-500 shadow-sm min-h-[60px] transition-all outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block font-semibold text-sky-700 mb-1"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Mô tả"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-sky-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-sky-500 shadow-sm min-h-[60px] transition-all outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <input
            id="is_prescription_required"
            name="is_prescription_required"
            type="checkbox"
            checked={!!form.is_prescription_required}
            onChange={handleChange}
            className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-blue-400"
          />
          <label
            htmlFor="is_prescription_required"
            className="font-semibold text-sky-700 select-none cursor-pointer"
          >
            Thuốc kê đơn (yêu cầu đơn thuốc)
          </label>
        </div>
        <DialogFooter className="flex flex-row gap-3 pt-4">
          <Button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-lg px-8 py-2 rounded-lg shadow font-semibold disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Đang lưu...
              </span>
            ) : isEdit ? (
              "Lưu thay đổi"
            ) : (
              "Thêm"
            )}
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="px-8 py-2 rounded-lg"
            >
              Hủy
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const EditHealthRecordDialogSchema = z.object({
  allergies: z.string().optional(),
  chronic_conditions: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  vision: z.string().optional(),
  hearing: z.string().optional(),
  blood_type: z.string().optional(),
  treatment_history: z.string().optional(),
  notes: z.string().optional(),
});

export type EditHealthRecordFormValues = z.infer<
  typeof EditHealthRecordDialogSchema
>;

export const defaultEditHealthRecordDialog: EditHealthRecordFormValues = {
  allergies: "",
  chronic_conditions: "",
  height: "",
  weight: "",
  vision: "",
  hearing: "",
  blood_type: "",
  treatment_history: "",
  notes: "",
};

interface EditHealthRecordProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: EditHealthRecordFormValues;
  onSubmit: (values: EditHealthRecordFormValues) => void;
  trigger?: React.ReactNode;
  studentName?: string;
}

export function EditHealthRecordDialog(props: EditHealthRecordProps) {
  const { open, onOpenChange, defaultValues, onSubmit, studentName } = props;
  const form = useForm<EditHealthRecordFormValues>({
    resolver: zodResolver(EditHealthRecordDialogSchema),
    defaultValues: defaultValues || defaultEditHealthRecordDialog,
  });

  // Reset form when dialog opens with new defaultValues
  useEffect(() => {
    if (open && defaultValues) {
      form.reset(defaultValues);
    }
  }, [open, defaultValues]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 rounded-2xl shadow-2xl border border-sky-200 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
                📝
              </div>
              Cập nhật hồ sơ sức khỏe
              {studentName && (
                <span className="text-sky-100 text-lg">- {studentName}</span>
              )}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-semibold text-sky-800 text-sm">
                  Dị ứng
                </label>
                <input
                  className="w-full border border-sky-200 rounded-lg px-4 py-3 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none transition-colors"
                  placeholder="Ví dụ: Hải sản, phấn hoa..."
                  {...form.register("allergies")}
                />
              </div>
              <div className="space-y-2">
                <label className="block font-semibold text-sky-800 text-sm">
                  Bệnh mãn tính
                </label>
                <input
                  className="w-full border border-sky-200 rounded-lg px-4 py-3 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none transition-colors"
                  placeholder="Ví dụ: Hen suyễn, tiểu đường..."
                  {...form.register("chronic_conditions")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-semibold text-sky-800 text-sm">
                  Chiều cao (cm)
                </label>
                <input
                  className="w-full border border-sky-200 rounded-lg px-4 py-3 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none transition-colors"
                  placeholder="120"
                  {...form.register("height")}
                />
              </div>
              <div className="space-y-2">
                <label className="block font-semibold text-sky-800 text-sm">
                  Cân nặng (kg)
                </label>
                <input
                  className="w-full border border-sky-200 rounded-lg px-4 py-3 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none transition-colors"
                  placeholder="25"
                  {...form.register("weight")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-semibold text-sky-800 text-sm">
                  Thị lực
                </label>
                <input
                  className="w-full border border-sky-200 rounded-lg px-4 py-3 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none transition-colors"
                  placeholder="Bình thường / Cận thị..."
                  {...form.register("vision")}
                />
              </div>
              <div className="space-y-2">
                <label className="block font-semibold text-sky-800 text-sm">
                  Thính lực
                </label>
                <input
                  className="w-full border border-sky-200 rounded-lg px-4 py-3 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none transition-colors"
                  placeholder="Bình thường / Kém..."
                  {...form.register("hearing")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-sky-800 text-sm">
                Nhóm máu
              </label>
              <input
                className="w-full border border-sky-200 rounded-lg px-4 py-3 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none transition-colors"
                placeholder="A, B, AB, O..."
                {...form.register("blood_type")}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-sky-800 text-sm">
                Lịch sử bệnh án
              </label>
              <textarea
                className="w-full border border-sky-200 rounded-lg px-4 py-3 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none transition-colors min-h-[80px] resize-vertical"
                placeholder="Mô tả chi tiết lịch sử bệnh án..."
                {...form.register("treatment_history")}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-sky-800 text-sm">
                Ghi chú
              </label>
              <textarea
                className="w-full border border-sky-200 rounded-lg px-4 py-3 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none transition-colors min-h-[80px] resize-vertical"
                placeholder="Ghi chú thêm về tình trạng sức khỏe..."
                {...form.register("notes")}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-sky-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-sky-300 text-sky-700 hover:bg-sky-50 hover:border-sky-400 px-6 py-2 rounded-xl font-medium"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                💾 Lưu thông tin
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

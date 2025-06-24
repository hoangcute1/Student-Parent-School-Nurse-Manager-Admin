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

export type EditHealthRecordFormValues = z.infer<typeof EditHealthRecordDialogSchema>;

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
      <DialogContent className="max-w-lg p-6 rounded-xl shadow-2xl border border-blue-100 bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-700 mb-2">
            Khai báo hồ sơ sức khỏe{studentName ? `: ${studentName}` : ""}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4"
        >
          <div>
            <label className="block font-semibold text-gray-600 mb-1">Dị ứng</label>
            <input
              className="w-full border rounded px-3 py-2"
              {...form.register("allergies")}
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-600 mb-1">Bệnh mãn tính</label>
            <input
              className="w-full border rounded px-3 py-2"
              {...form.register("chronic_conditions")}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-gray-600 mb-1">Chiều cao</label>
              <input
                className="w-full border rounded px-3 py-2"
                {...form.register("height")}
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-600 mb-1">Cân nặng</label>
              <input
                className="w-full border rounded px-3 py-2"
                {...form.register("weight")}
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 mb-1">Thị lực</label>
            <input
              className="w-full border rounded px-3 py-2"
              {...form.register("vision")}
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-600 mb-1">Thính lực</label>
            <input
              className="w-full border rounded px-3 py-2"
              {...form.register("hearing")}
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-600 mb-1">Nhóm máu</label>
            <input
              className="w-full border rounded px-3 py-2"
              {...form.register("blood_type")}
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-600 mb-1">Lịch sử bệnh án</label>
            <input
              className="w-full border rounded px-3 py-2"
              {...form.register("treatment_history")}
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-600 mb-1">Ghi chú</label>
            <input
              className="w-full border rounded px-3 py-2"
              {...form.register("notes")}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Lưu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    );
}
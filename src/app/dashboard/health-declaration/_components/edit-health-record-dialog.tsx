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
import { DialogClose, DialogDescription, DialogTrigger, Trigger } from "@radix-ui/react-dialog";
import { Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-blue-200 bg-white">
        <DialogHeader className="border-b border-blue-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-blue-800">
                Khai báo hồ sơ sức khỏe: {studentName}
              </DialogTitle>
              <DialogDescription className="text-blue-600 text-lg">
                Khai báo chi tiết về sức khỏe và lịch sử y tế của học sinh
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 p-2">
            {/* Card chỉ số sức khỏe */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <Heart className="h-4 w-4 text-green-600" />
                  Chỉ số sức khỏe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-green-600 block">Chiều cao (cm)</label>
                    <input className="text-green-900 font-medium bg-white px-3 py-2 rounded-lg border border-green-200 w-full" placeholder="Nhập chiều cao" {...form.register("height")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-green-600 block">Cân nặng (kg)</label>
                    <input className="text-green-900 font-medium bg-white px-3 py-2 rounded-lg border border-green-200 w-full" placeholder="Nhập cân nặng" {...form.register("weight")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-green-600 block">Nhóm máu</label>
                    <input className="text-green-900 font-medium bg-white px-3 py-2 rounded-lg border border-green-200 w-full" placeholder="A, B, AB, O..." {...form.register("blood_type")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-green-600 block">Thị lực</label>
                    <input className="text-green-900 font-medium bg-white px-3 py-2 rounded-lg border border-green-200 w-full" placeholder="10/10, 8/10..." {...form.register("vision")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-green-600 block">Thính lực</label>
                    <input className="text-green-900 font-medium bg-white px-3 py-2 rounded-lg border border-green-200 w-full" placeholder="Bình thường, kém..." {...form.register("hearing")} />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Card tình trạng y tế */}
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-amber-800 mb-2">
                  <span className="inline-block w-6 h-6 bg-amber-500 rounded-lg flex items-center justify-center"><Heart className="h-4 w-4 text-white" /></span>
                  Tình trạng y tế
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-600 block">Dị ứng</label>
                    <input className="text-amber-900 font-medium bg-white px-3 py-2 rounded-lg border border-amber-200 w-full" placeholder="Không có/ghi rõ" {...form.register("allergies")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-600 block">Bệnh mãn tính</label>
                    <input className="text-amber-900 font-medium bg-white px-3 py-2 rounded-lg border border-amber-200 w-full" placeholder="Không có/ghi rõ" {...form.register("chronic_conditions")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-600 block">Lịch sử bệnh án</label>
                    <textarea className="text-amber-900 font-medium bg-white px-3 py-2 rounded-lg border border-amber-200 min-h-[80px] resize-vertical w-full" placeholder="Mô tả chi tiết..." {...form.register("treatment_history")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-600 block">Ghi chú</label>
                    <textarea className="text-amber-900 font-medium bg-white px-3 py-2 rounded-lg border border-amber-200 min-h-[80px] resize-vertical w-full" placeholder="Ghi chú thêm..." {...form.register("notes")} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="border-t border-blue-100 pt-4 flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              Lưu thông tin
            </Button>
          </div>
        </form>

        {/* Footer với nút đóng */}

      </DialogContent>
    </Dialog>

  );
}

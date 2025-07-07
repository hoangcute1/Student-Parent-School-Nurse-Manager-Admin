"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MedicationFormDialog } from "./medication-form-dialog";

interface AddMedicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function AddMedicationDialog({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
}: AddMedicationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-sky-200 bg-white/95 backdrop-blur-sm">
        <DialogHeader className="border-b border-sky-100 pb-4">
          <DialogTitle className="text-sky-800 text-lg font-semibold">
            Thêm thuốc mới
          </DialogTitle>
        </DialogHeader>
        <MedicationFormDialog onSubmit={onSubmit} onCancel={onCancel} />
      </DialogContent>
    </Dialog>
  );
}

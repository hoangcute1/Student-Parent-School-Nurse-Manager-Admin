import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MedicationFormDialog } from "./medication-form-dialog";
import { Medication } from "@/lib/type/medications";

interface UpdateMedicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medication: Medication | null;
  onSubmit: (data: Medication) => void;
  onCancel: () => void;
}

export function UpdateMedicationDialog({
  open,
  onOpenChange,
  medication,
  onSubmit,
  onCancel,
}: UpdateMedicationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin thuốc</DialogTitle>
        </DialogHeader>
        <MedicationFormDialog
          defaultValues={medication || undefined}
          isEdit={true}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}

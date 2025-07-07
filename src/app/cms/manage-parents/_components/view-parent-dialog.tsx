import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Parent } from "@/lib/type/parents";

interface ViewParentDialogProps {
  parent: Parent;
  onClose: () => void;
}

export function ViewParentDialog({ parent, onClose }: ViewParentDialogProps) {
  const profile = parent.profile || {};
  const user = parent.user || {};
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-xl border border-sky-200">
        <DialogHeader>
          <DialogTitle className="text-sky-800 text-2xl font-bold mb-4 text-left">
            Thông tin phụ huynh:
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4 items-start">
          <div className="text-2xl font-semibold text-sky-900 mb-2">
            {profile.name || "Chưa có tên"}
          </div>
          <div className="w-full flex flex-col gap-3 text-sky-800 text-lg">
            <div className="flex justify-between">
              <span className="font-medium">Giới tính:</span>
              <span>
                {profile.gender === "male"
                  ? "Nam"
                  : profile.gender === "female"
                  ? "Nữ"
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Số điện thoại:</span>
              <span>{profile.phone || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Địa chỉ:</span>
              <span>{profile.address || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{user.email || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Ngày tạo:</span>
              <span>
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString("vi-VN")
                  : "-"}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full mt-4 border-sky-300 text-sky-800 font-semibold text-lg hover:bg-sky-50">
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

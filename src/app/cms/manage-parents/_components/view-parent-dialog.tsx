import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-blue-800 text-xl font-bold">
            Thông tin phụ huynh
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <Avatar className="h-16 w-16 border border-blue-200 shadow">
            <AvatarImage
              src={`/placeholder.svg?height=64&width=64&text=${
                profile.name?.charAt(0) || "P"
              }`}
            />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
              {profile.name?.charAt(0) || "P"}
            </AvatarFallback>
          </Avatar>
          <div className="text-lg font-semibold text-blue-900 mb-2">
            {profile.name || "Chưa có tên"}
          </div>
          <div className="w-full grid grid-cols-1 gap-2 text-blue-700">
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Giới tính:</span>
              <span>{profile.gender || "-"}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Số điện thoại:</span>
              <span>{profile.phone || "-"}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Địa chỉ:</span>
              <span>{profile.address || "-"}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
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
          <Button variant="outline" onClick={onClose} className="w-full mt-2">
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

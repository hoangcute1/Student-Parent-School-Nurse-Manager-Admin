"use client";

import { useEffect } from "react";
import { Clock, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMedicineDeliveryStore } from "@/stores/medicine-delivery-store";
import { useMedicationStore } from "@/stores/medication-store";
import AddMedicineDeliveryForm from "./_components/add-medications-dialog";

export default function MedicationsPage() {
  const {
    medicineDeliveryByParentId,
    isLoading,
    fetchMedicineDeliveryByParentId,
  } = useMedicineDeliveryStore();
  const { medications } = useMedicationStore();

  useEffect(() => {
    fetchMedicineDeliveryByParentId();
  }, [fetchMedicineDeliveryByParentId]);
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Gửi thuốc cho học sinh
        </h1>
        <p className="text-blue-600">Theo dõi thuốc của học sinh</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end mb-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="bg-blue-700 text-white hover:bg-blue-800 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" /> Thêm đơn thuốc
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm đơn thuốc mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin đơn thuốc cho học sinh
                </DialogDescription>
              </DialogHeader>
              <AddMedicineDeliveryForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border border-blue-200">
          <Table>
            <TableHeader className="bg-blue-50">
              <TableRow>
                <TableHead className="text-blue-800">Tên học sinh</TableHead>
                <TableHead className="text-blue-800">Tên thuốc</TableHead>
                <TableHead>Liều lượng</TableHead>
                <TableHead>Thời gian dùng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : medicineDeliveryByParentId.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Không có đơn thuốc nào
                  </TableCell>
                </TableRow>
              ) : (
                medicineDeliveryByParentId.map((delivery, idx) => (
                  <TableRow key={delivery.id || idx}>
                    <TableCell className="font-medium">
                      {delivery.student.name || "N/A"}
                    </TableCell>
                    <TableCell>
                      {typeof delivery.medicine === "object" &&
                      delivery.medicine !== null &&
                      "name" in delivery.medicine
                        ? (delivery.medicine as any).name
                        : medications.find(
                            (m) => m._id === delivery.medicine._id
                          )?.name ||
                          delivery.medicine ||
                          "N/A"}
                    </TableCell>
                    <TableCell>{delivery.per_dose}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-orange-500" />
                        {delivery.per_day} lần/ngày
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          delivery.status === "pending"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {delivery.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

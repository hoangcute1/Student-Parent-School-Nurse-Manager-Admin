"use client";

import { useEffect, useState } from "react";
import { Clock, Plus, MoreHorizontal, Eye, Trash2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMedicineDeliveryStore } from "@/stores/medicine-delivery-store";
import { useMedicationStore } from "@/stores/medication-store";
import AddMedicineDeliveryForm from "./_components/add-medications-dialog";
import { MedicationDetailDialog } from "./_components/medication-detail-dialog";
import { useToast } from "@/components/ui/use-toast";

export default function MedicationsPage() {
  const {
    medicineDeliveryByParentId,
    isLoading,
    fetchMedicineDeliveryByParentId,
    deleteMedicineDelivery,
    viewMedicineDeliveries
  } = useMedicineDeliveryStore();
  const { medications } = useMedicationStore();
  const { toast } = useToast();

  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!medicationToDelete) return;

    try {
      await deleteMedicineDelivery(medicationToDelete);
      await fetchMedicineDeliveryByParentId();
      setMedicationToDelete(null);

      toast({
        title: "Thành công!",
        description: "Đã xóa đơn thuốc thành công",
        duration: 3000,
        variant: "default",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: "Không thể xóa đơn thuốc. Vui lòng thử lại sau.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await viewMedicineDeliveries(id);
      console.log("API Response:", response); // Thêm log để kiểm tra

      // Kiểm tra và xử lý dữ liệu
      if (response) {
        // Thêm log để kiểm tra
        setSelectedMedication(response);
        setShowDetailDialog(true);
      } else {
        console.error("No data available or invalid response format:", response);
      }
    } catch (error) {
      console.error("Error fetching medication details:", error);
    }
  };

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
                        : medications.find((m) => m._id === delivery.medicine._id)
                          ?.name ||
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(delivery.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 hover:text-red-800"
                            onClick={() => setMedicationToDelete(delivery.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!medicationToDelete} onOpenChange={() => setMedicationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đơn thuốc này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MedicationDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        medication={selectedMedication}
      />
    </div>
  );
}

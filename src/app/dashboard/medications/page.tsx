"use client";

import { useEffect, useState } from "react";
import { Clock, Plus, Search, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { MedicineDelivery, MedicineDeliveryByParentId } from "@/lib/type/medicine-delivery";

// Giả sử bạn lấy parentId từ localStorage, context, hoặc store đăng nhập
// Thay bằng cách lấy parentId thực tế
const mapDeliveriesForDisplay = (
  deliveries: MedicineDelivery
): MedicineDelivery => {
  return {
    ...deliveries,
  };
};
export default function MedicationsPage() {
  const { medicineDeliveries, isLoading, fetchMedicineDeliveryByParentId } =
    useMedicineDeliveryStore();
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const displayDeliveries = medicineDeliveries
    .map(mapDeliveriesForDisplay)
    .filter((deliveriesData) => {
      // Apply search filter if exists
      if (searchQuery && searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          deliveriesData.student?.name.toLowerCase().includes(query) ||
          deliveriesData.medicine.name.toLowerCase().includes(query) ||
          deliveriesData.per_dose.toLowerCase().includes(query) ||
          deliveriesData.status.toLowerCase().includes(query)
        );
      }
      return true; // No filter applied
    })


  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Gửi thuốc cho học sinh
        </h1>
        <p className="text-blue-600">Theo dõi thuốc của học sinh</p>
      </div>

      <div className="space-y-4">
        {/* ...phần Dialog thêm thuốc giữ nguyên... */}

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
              ) : medicineDeliveries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Không có đơn thuốc nào
                  </TableCell>
                </TableRow>
              ) : (
                medicineDeliveries.map((delivery, idx) => (
                  <TableRow key={delivery.id || idx}>
                    <TableCell className="font-medium">
                      {delivery.student?.name}
                    </TableCell>
                    <TableCell>{delivery.medicine?.name}</TableCell>
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

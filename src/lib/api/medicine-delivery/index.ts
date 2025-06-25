
import { CreateMedicineDelivery, MedicineDeliveryByParentId, MedicineDeliveryParentResponse, MedicineDeliveryResponse } from "@/lib/type/medicine-delivery";
import { fetchData } from "../api";

const getAllMedicineDeliveries = async (): Promise<MedicineDeliveryResponse> => {
  try {
    const response = await fetchData<MedicineDeliveryResponse>("/medicine-deliveries");
    return response.data ? response : { data: [], total: 0 };
  } catch (error: any) {
    console.error("Error fetching medicine deliveries:", error);
    throw new Error(error.message || "Không thể lấy danh sách đơn thuốc");
  }
};

const getMedicineDeliveriesByParentID = async (parentId: string): Promise<MedicineDeliveryByParentId[]> => {
  try {
    const response = await fetchData<MedicineDeliveryParentResponse>(`/medicine-deliveries/parent/${parentId}`);
    return response.data || [];
  } catch (error: any) {
    console.error(`Error fetching medicine deliveries for parent ID ${parentId}:`, error);
    throw new Error(error.message || "Không thể lấy đơn thuốc theo ID phụ huynh");
  }
};

const createMedicineDeliveries = async (data: CreateMedicineDelivery): Promise<CreateMedicineDelivery> => {
  try {
    const response = await fetchData<CreateMedicineDelivery>("/medicine-deliveries", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error: any) {
    console.error("Error creating medicine delivery:", error);
    throw new Error(error.message || "Không thể tạo đơn thuốc mới");
  }
};

export { getAllMedicineDeliveries, createMedicineDeliveries, getMedicineDeliveriesByParentID };
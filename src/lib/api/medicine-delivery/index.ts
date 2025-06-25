import {
  CreateMedicineDelivery,
  MedicineDeliveryByParent,
  MedicineDeliveryParentResponse,
  MedicineDeliveryResponse,
} from "@/lib/type/medicine-delivery";
import { fetchData } from "../api";
import { getAuthToken, parseJwt } from "../auth/token";

const getAllMedicineDeliveries =
  async (): Promise<MedicineDeliveryResponse> => {
    try {
      const response = await fetchData<MedicineDeliveryResponse>(
        "/medicine-deliveries"
      );
      return response.data ? response : { data: [], total: 0 };
    } catch (error: any) {
      console.error("Error fetching medicine deliveries:", error);
      throw new Error(error.message || "Không thể lấy danh sách đơn thuốc");
    }
  };

const getMedicineDeliveriesByParentId = async (
  userId: string
): Promise<MedicineDeliveryByParent[]> => {
  try {
    console.log("Fetching medicine deliveries for user ID:", userId);

    console.log("Fetching medicine deliveries for user ID:", userId);
    const response = await fetchData<MedicineDeliveryParentResponse>(
      `/medicine-deliveries/parent/${userId}`
    );
    return response.data || [];
  } catch (error: any) {
    console.error(
      `Error fetching medicine deliveries for parent user Id`,
      error
    );
    throw new Error(
      error.message || "Không thể lấy đơn thuốc theo ID phụ huynh"
    );
  }
};

const createMedicineDeliveries = async (
  data: CreateMedicineDelivery
): Promise<CreateMedicineDelivery> => {
  try {
    const response = await fetchData<CreateMedicineDelivery>(
      "/medicine-deliveries",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return response;
  } catch (error: any) {
    console.error("Error creating medicine delivery:", error);
    throw new Error(error.message || "Không thể tạo đơn thuốc mới");
  }
};

export {
  getAllMedicineDeliveries,
  createMedicineDeliveries,
  getMedicineDeliveriesByParentId,
};

import { getMedicationById } from "./../medication";
import {
  CreateMedicineDelivery,
  MedicineDelivery,
  MedicineDeliveryByParent,
  // MedicineDeliveryByStaff,
  MedicineDeliveryParentResponse,
  MedicineDeliveryResponse,
  // MedicineDeliveryStaffResponse,
} from "@/lib/type/medicine-delivery";
import { fetchData } from "../api";

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

// const getMedicineDeliveriesByStaffId = async (
//   userId: string
// ): Promise<MedicineDeliveryByStaff[]> => {
//   try {
//     console.log("Fetching medicine deliveries for user ID:", userId);

//     console.log("Fetching medicine deliveries for user ID:", userId);
//     const response = await fetchData<MedicineDeliveryStaffResponse>(
//       `/medicine-deliveries/staff/${userId}`
//     );
//     return response.data || [];
//   } catch (error: any) {
//     console.error(
//       `Error fetching medicine deliveries for parent user Id`,
//       error
//     );
//     throw new Error(
//       error.message || "Không thể lấy đơn thuốc theo ID phụ huynh"
//     );
//   }
// };

const getMedicineDeliveriesById = async (
  id: string
): Promise<MedicineDeliveryResponse> => {
  try {
    console.log("Fetching medicine delivery with ID:", id); // Thêm log

    const response = await fetchData<MedicineDeliveryResponse>(
      `/medicine-deliveries/${id}`
    );

    console.log("API Response:", response); // Thêm log để kiểm tra response

    if (!response || !response) {
      throw new Error("Không tìm thấy thông tin đơn thuốc");
    }

    return response;
  } catch (error: any) {
    console.error("Error fetching medicine delivery:", error);
    throw new Error(error.message || "Không thể lấy thông tin đơn thuốc");
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

const createManyMedicineDeliveries = async (
  data: CreateMedicineDelivery[]
): Promise<CreateMedicineDelivery[]> => {
  try {
    const response = await fetchData<CreateMedicineDelivery[]>(
      "/medicine-deliveries/bulk",
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

const updateMedicineDelivery = async (
  id: string,
  data: Partial<MedicineDeliveryResponse>
) => {
  try {
    const response = await fetchData(`/medicine-deliveries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error: any) {
    console.error("Error updating medicine delivery:", error);
    throw new Error(error.message || "Không thể cập nhật đơn thuốc");
  }
};

const deleteMedicineDelivery = async (id: string) => {
  try {
    console.log("Deleting medicine delivery with ID:", id);
    const response = await fetchData(`/medicine-deliveries/${id}`, {
      method: "DELETE",
    });
    console.log("Delete API response:", response);
    return response;
  } catch (error: any) {
    console.error("Error deleting medicine delivery:", error);
    throw new Error(error.message || "Không thể xóa đơn thuốc");
  }
};

// Soft delete cho admin/staff - chỉ ẩn khỏi view của họ
const softDeleteMedicineDelivery = async (id: string) => {
  try {
    console.log("Soft deleting medicine delivery with ID:", id);
    const response = await fetchData(`/medicine-deliveries/${id}/soft-delete`, {
      method: "PATCH",
    });
    console.log("Soft delete API response:", response);
    return response;
  } catch (error: any) {
    console.error("Error soft deleting medicine delivery:", error);
    throw new Error(error.message || "Không thể ẩn đơn thuốc");
  }
};

export {
  getAllMedicineDeliveries,
  createMedicineDeliveries,
  getMedicineDeliveriesByParentId,
  getMedicineDeliveriesById,
  updateMedicineDelivery,
  deleteMedicineDelivery,
  softDeleteMedicineDelivery,
  // getMedicineDeliveriesByStaffId,
  createManyMedicineDeliveries,
};

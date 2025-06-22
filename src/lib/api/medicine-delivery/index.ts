import { MedicineDeliveryResponse } from "@/lib/type/medicine-delivery";
import { fetchData } from "../api";

const getAllMedicineDeliveries = async () => {
  try {
    const response = await fetchData<MedicineDeliveryResponse>(
      "/medicine-deliveries"
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching medicine deliveries:", error);
    throw error;
  }
};

export { getAllMedicineDeliveries };

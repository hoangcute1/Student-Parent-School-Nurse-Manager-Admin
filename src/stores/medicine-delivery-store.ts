import { getAllMedicineDeliveries } from "@/lib/api/medicine-delivery";
import { MedicineDeliveryStore } from "@/lib/type/medicine-delivery";
import { create } from "zustand";

export const useMedicineDeliveryStore = create<MedicineDeliveryStore>(
  (set, get) => ({
    medicineDeliveries: [],
    isLoading: false,
    error: null,

    fetchMedicineDeliveries: async () => {
      try {
        set({ isLoading: true, error: null });
        console.log("Fetching medicine delivery...");
        const response = await getAllMedicineDeliveries();
        console.log("Parents response:", response);

        // Process the response into an array
        const parentsList = Array.isArray(response) ? response : [];

        set({
          medicineDeliveries: parentsList,
          error: null,
        });
      } catch (err: any) {
        const errorMessage =
          err.message || "Failed to fetch medicine deliveries";
        set({ error: errorMessage, medicineDeliveries: [] });
      } finally {
        set({ isLoading: false });
      }
    },
    addMedicineDelivery: async (data) => {},
    updateMedicineDelivery: async (id, data) => {},
    deleteMedicineDelivery: async (id) => {},
    setIsLoading: (loading) => {
      set({ isLoading: loading });
    },
    setError: (error) => {
      set({ error });
    },
  })
);

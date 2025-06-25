import {
  createMedicineDeliveries,
  getAllMedicineDeliveries,
  getMedicineDeliveriesByParentID,
} from "@/lib/api/medicine-delivery";
import {
  CreateMedicineDelivery,
  MedicineDeliveryStore,
  MedicineDeliveryByParentId,
} from "@/lib/type/medicine-delivery";
import { create } from "zustand";

export const useMedicineDeliveryStore = create<MedicineDeliveryStore>(
  (set, get) => ({
    medicineDeliveries: [],
    isLoading: false,
    error: null,
    students: [],
    medicineDeliveryByParentId: [],

    fetchMedicineDeliveries: async () => {
      try {
        set({ isLoading: true, error: null });
        const response = await getAllMedicineDeliveries();
        set({
          medicineDeliveries: response.data || [],
          error: null,
        });
      } catch (err: any) {
        const errorMessage =
          err.message || "Failed to fetch medicine deliveries";
        set({ error: errorMessage });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    fetchMedicineDeliveryByParentId: async (parentId: string): Promise<MedicineDeliveryByParentId[]> => {
      try {
        set({ isLoading: true, error: null });
        const response = await getMedicineDeliveriesByParentID(parentId);
        set({ medicineDeliveryByParentId: response || [] });
        return response;
      } catch (err: any) {
        const errorMessage =
          err.message || "Failed to fetch medicine delivery by parent ID";
        set({ error: errorMessage });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    addMedicineDelivery: async (data: CreateMedicineDelivery) => {
      try {
        set({ isLoading: true, error: null });
        const response = await createMedicineDeliveries(data);
        // Ensure response is of type MedicineDeliveryByParentId before adding
        set({ 
          medicineDeliveryByParentId: [
            ...get().medicineDeliveryByParentId,
            ...(Array.isArray(response) ? response : [response]).filter(
              (item): item is MedicineDeliveryByParentId =>
                item && "student" in item && "staff" in item
            ),
          ],
          error: null,
        });
        return response;
      } catch (err: any) {
        const errorMessage = err.message || "Failed to add medicine delivery";
        set({ error: errorMessage });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    updateMedicineDelivery: async (id: string, data: any) => {
      // TODO: Implement update logic
      console.warn("updateMedicineDelivery not implemented");
    },

    deleteMedicineDelivery: async (id: string) => {
      // TODO: Implement delete logic
      console.warn("deleteMedicineDelivery not implemented");
    },

    setIsLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },
    setError: (error: string | null) => {
      set({ error });
    },
  })
);
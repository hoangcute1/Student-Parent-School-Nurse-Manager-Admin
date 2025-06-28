import { getAuthToken, parseJwt } from "@/lib/api/auth/token";
import {
  createMedicineDeliveries,
  deleteMedicineDelivery,
  getAllMedicineDeliveries,
  getMedicineDeliveriesById,
  getMedicineDeliveriesByParentId,
  updateMedicineDelivery,
} from "@/lib/api/medicine-delivery";
import {
  CreateMedicineDelivery,
  MedicineDeliveryStore,
  MedicineDeliveryByParent,
  MedicineDeliveryParentResponse,
} from "@/lib/type/medicine-delivery";
import type { MedicineDelivery } from "@/lib/type/medicine-delivery";
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

    viewMedicineDeliveries: async (id: string) => {
      try {
        set({ isLoading: true, error: null });
        const response = await getMedicineDeliveriesById(id);
        console.log("Store Response:", response); // Thêm log

        if (!response) {
          throw new Error("Không tìm thấy thông tin đơn thuốc");
        }

        // Trả về dữ liệu đã được xử lý
        return Array.isArray(response) ? response[0] : response;
      } catch (err: any) {
        const errorMessage = err.message || "Không thể lấy thông tin đơn thuốc";
        set({ error: errorMessage });
        console.error("Lỗi khi xem đơn thuốc:", err);
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    fetchMedicineDeliveryByParentId: async (): Promise<void> => {
      try {
        set({ isLoading: true, error: null });
        const token = getAuthToken();
        console.log(token);
        if (!token) {
          throw new Error("Không tìm thấy token xác thực");
        }
        const userId = parseJwt(token)?.sub;
        if (!userId) {
          throw new Error("Không tìm thấy ID người dùng trong token");
        }
        const response = await getMedicineDeliveriesByParentId(userId);
        set({ medicineDeliveryByParentId: response || [] });
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
              (item): item is MedicineDeliveryByParent =>
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

    deleteMedicineDelivery: async (id: string) => {
      try {
        set({ isLoading: true, error: null });
        await deleteMedicineDelivery(id);

        // Remove the deleted item from both lists in the store
        set((state) => ({
          medicineDeliveries: state.medicineDeliveries.filter(
            (delivery) => delivery.id !== id
          ),
          medicineDeliveryByParentId: state.medicineDeliveryByParentId.filter(
            (delivery) => delivery.id !== id
          ),
        }));
      } catch (err: any) {
        const errorMessage = err.message || "Không thể xóa đơn thuốc";
        set({ error: errorMessage });
        console.error("Lỗi khi xóa đơn thuốc:", err);
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    updateMedicineDelivery: async (
      id: string,
      data: Partial<MedicineDelivery>
    ) => {
      try {
        set({ isLoading: true, error: null });
        await updateMedicineDelivery(id, data);
      } catch (err: any) {
        set({ error: err.message || "Không thể cập nhật đơn thuốc" });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    setIsLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },
    setError: (error: string | null) => {
      set({ error });
    },
  })
);

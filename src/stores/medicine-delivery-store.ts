import { getAuthToken, parseJwt } from "@/lib/api/auth/token";
import {
  createMedicineDeliveries,
  deleteMedicineDelivery as deleteMedicineDeliveryAPI,
  softDeleteMedicineDelivery as softDeleteMedicineDeliveryAPI,
  getAllMedicineDeliveries,
  getMedicineDeliveriesById,
  getMedicineDeliveriesByParentId,
  getMedicineDeliveriesByStaffId,
  updateMedicineDelivery,
} from "@/lib/api/medicine-delivery";
import {
  CreateMedicineDelivery,
  MedicineDeliveryStore,
  MedicineDeliveryByParent,
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
    medicineDeliveryByStaffId: [],

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
        console.log("Token in fetchMedicineDeliveryByParentId:", token);
        if (!token) {
          console.log("No auth token found, skipping fetch");
          set({ isLoading: false });
          return;
        }
        const userId = parseJwt(token)?.sub;
        if (!userId) {
          console.log("No user ID found in token, skipping fetch");
          set({ isLoading: false });
          return;
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

    fetchMedicineDeliveryByStaffId: async (): Promise<void> => {
      try {
        set({ isLoading: true, error: null });
        const token = getAuthToken();
        console.log("Token in fetchMedicineDeliveryByStaffId:", token);
        if (!token) {
          console.log("No auth token found, skipping fetch");
          set({ isLoading: false });
          return;
        }
        const userId = parseJwt(token)?.sub;
        if (!userId) {
          console.log("No user ID found in token, skipping fetch");
          set({ isLoading: false });
          return;
        }
        const response = await getMedicineDeliveriesByStaffId(userId);
        set({ medicineDeliveryByStaffId: response || [] });
      } catch (err: any) {
        const errorMessage =
          err.message || "Failed to fetch medicine delivery by staff ID";
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

    // Xóa hoàn toàn đơn thuốc (cho phụ huynh)
    deleteMedicineDelivery: async (id: string) => {
      try {
        console.log("Starting delete medicine delivery with ID:", id);
        set({ isLoading: true, error: null });

        await deleteMedicineDeliveryAPI(id);
        console.log("Successfully deleted medicine delivery from API");

        // Cập nhật lại tất cả danh sách đơn thuốc sau khi xoá
        const currentState = get();
        console.log("Current state before update:", {
          parentCount: currentState.medicineDeliveryByParentId.length,
          staffCount: currentState.medicineDeliveryByStaffId.length,
          allCount: currentState.medicineDeliveries.length,
        });

        // Cập nhật danh sách cho phụ huynh
        const updatedParentDeliveries =
          currentState.medicineDeliveryByParentId.filter(
            (delivery) => delivery.id !== id
          );

        // Cập nhật danh sách cho nhân viên
        const updatedStaffDeliveries =
          currentState.medicineDeliveryByStaffId.filter(
            (delivery) => delivery.id !== id
          );

        // Cập nhật danh sách chung cho quản lý
        const updatedAllDeliveries = currentState.medicineDeliveries.filter(
          (delivery) => delivery.id !== id
        );

        console.log("Updated counts after filter:", {
          parentCount: updatedParentDeliveries.length,
          staffCount: updatedStaffDeliveries.length,
          allCount: updatedAllDeliveries.length,
        });

        set({
          medicineDeliveryByParentId: updatedParentDeliveries,
          medicineDeliveryByStaffId: updatedStaffDeliveries,
          medicineDeliveries: updatedAllDeliveries,
        });

        console.log("Successfully updated store state after deletion");
      } catch (err: any) {
        console.error("Error in deleteMedicineDelivery:", err);
        set({ error: err.message || "Không thể xoá đơn thuốc" });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    // Soft delete cho admin/staff - chỉ ẩn khỏi view của họ
    softDeleteMedicineDelivery: async (id: string) => {
      try {
        console.log("Starting soft delete medicine delivery with ID:", id);
        set({ isLoading: true, error: null });

        await softDeleteMedicineDeliveryAPI(id);
        console.log("Successfully soft deleted medicine delivery from API");

        // Chỉ cập nhật danh sách cho nhân viên/admin, không ảnh hưởng đến phụ huynh
        const currentState = get();

        // Chỉ xóa khỏi view staff và admin
        const updatedStaffDeliveries =
          currentState.medicineDeliveryByStaffId.filter(
            (delivery) => delivery.id !== id
          );

        const updatedAllDeliveries = currentState.medicineDeliveries.filter(
          (delivery) => delivery.id !== id
        );

        set({
          medicineDeliveryByStaffId: updatedStaffDeliveries,
          medicineDeliveries: updatedAllDeliveries,
          // Không cập nhật medicineDeliveryByParentId để phụ huynh vẫn thấy được
        });

        console.log("Successfully updated store state after soft deletion");
      } catch (err: any) {
        console.error("Error in softDeleteMedicineDelivery:", err);
        set({ error: err.message || "Không thể ẩn đơn thuốc" });
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

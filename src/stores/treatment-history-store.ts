import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  getAllTreatmentHistories, 
  getTreatmentHistoryByParentId, 
  updateTreatmentHistory 
} from "@/lib/api/treatment-history";
import { TreatmentHistory } from "@/lib/type/treatment-history";

interface TreatmentHistoryStore {
  treatmentHistories: TreatmentHistory[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  
  // Actions
  fetchAllTreatmentHistories: () => Promise<void>;
  fetchTreatmentHistoryByParentId: (parentId: string) => Promise<void>;
  updateTreatmentHistoryItem: (id: string, data: Partial<TreatmentHistory>) => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

export const useTreatmentHistoryStore = create<TreatmentHistoryStore>()(
  persist(
    (set, get) => ({
      treatmentHistories: [],
      isLoading: false,
      error: null,
      lastUpdated: null,

      fetchAllTreatmentHistories: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await getAllTreatmentHistories();
          set({ 
            treatmentHistories: data, 
            isLoading: false, 
            lastUpdated: Date.now() 
          });
        } catch (error) {
          set({ 
            error: "Không thể tải danh sách lịch sử bệnh án", 
            isLoading: false 
          });
          console.error("Error fetching all treatment histories:", error);
        }
      },

      fetchTreatmentHistoryByParentId: async (parentId: string) => {
        set({ isLoading: true, error: null });
        try {
          const data = await getTreatmentHistoryByParentId(parentId);
          set({ 
            treatmentHistories: data, 
            isLoading: false, 
            lastUpdated: Date.now() 
          });
        } catch (error) {
          set({ 
            error: "Không thể tải lịch sử bệnh án", 
            isLoading: false 
          });
          console.error("Error fetching treatment history by parent ID:", error);
        }
      },

      updateTreatmentHistoryItem: async (id: string, data: Partial<TreatmentHistory>) => {
        try {
          const updatedItem = await updateTreatmentHistory(id, data);
          const currentHistories = get().treatmentHistories;
          
          // Cập nhật item trong danh sách
          const updatedHistories = currentHistories.map(item => 
            item._id === id ? { ...item, ...updatedItem } : item
          );
          
          set({ 
            treatmentHistories: updatedHistories, 
            lastUpdated: Date.now() 
          });
          
          return updatedItem;
        } catch (error) {
          set({ error: "Không thể cập nhật lịch sử bệnh án" });
          console.error("Error updating treatment history:", error);
          throw error;
        }
      },

      refreshData: async () => {
        const { fetchAllTreatmentHistories } = get();
        await fetchAllTreatmentHistories();
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "treatment-history-storage",
      version: 1,
    }
  )
); 
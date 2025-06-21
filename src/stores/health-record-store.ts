import { create } from "zustand";
import { 
  getParentChildrenHealthRecords,
  createHealthRecord
} from "@/lib/api/health-record";
import { 
  HealthRecord, 
  HealthRecordFormValues,
  HealthRecordStore 
} from "@/lib/type/health-record";

export const useHealthRecordStore = create<HealthRecordStore>((set) => ({
  records: [],
  isLoading: false,
  error: null,
  
  fetchRecords: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log("Fetching health records...");
      const response = await getParentChildrenHealthRecords();
      console.log("Health records response:", response);

      // Process the response into an array
      const recordsList = Array.isArray(response) ? response : [];

      set({
        records: recordsList,
        error: null,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch health records";
      console.error("Failed to fetch health records:", err);
      set({ error: errorMessage, records: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addRecord: async (data: HealthRecordFormValues) => {
    try {
      set({ isLoading: true, error: null });
      const newRecord = await createHealthRecord(data);

      // Update the store with the new record
      set((state) => ({
        records: [...state.records, newRecord],
      }));
    } catch (err: any) {
      set({ error: err.message });
      console.error("Failed to create health record:", err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));

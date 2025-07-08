import { create } from "zustand";
import { persist } from "zustand/middleware";
import { client } from "@/lib/utils";

export interface ExportRecord {
  _id: string;
  medicineId: {
    _id: string;
    name: string;
    unit: string;
  };
  quantity: number;
  reason: string;
  medicalStaffName: string;
  exportDate: string;
}

interface ExportHistoryStore {
  exportHistory: ExportRecord[];
  isLoading: boolean;
  error: string | null;
  fetchExportHistory: () => Promise<void>;
}

export const useExportHistoryStore = create<ExportHistoryStore>()(
  persist(
    (set) => ({
      exportHistory: [],
      isLoading: false,
      error: null,
      fetchExportHistory: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await client.get("/export-history");
          set({ exportHistory: data, isLoading: false });
        } catch (error) {
          set({ error: "Failed to fetch export history", isLoading: false });
        }
      },
    }),
    {
      name: "export-history-storage",
      version: 1,
    }
  )
);

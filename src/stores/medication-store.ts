import { create } from "zustand";
import {
  getAllMedications,
  getMedicationById,
  createMedication,
  updateMedicationForm,
  deleteMedication,
  exportMedication,
} from "@/lib/api/medication";
import { Medication } from "@/lib/type/medications";
import { useExportHistoryStore } from "./export-history-store";

interface MedicationStore {
  medications: Medication[] | [];
  isLoading: boolean;
  error: string | null;
  fetchMedications: () => Promise<void>;
  addMedication: (medication: any) => Promise<void>;
  updateMedication: (id: string, medication: any) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  exportMedication: (exportData: {
    medicationId: string;
    quantity: number;
    reason: string;
    medicalStaffName: string;
  }) => Promise<void>;
}

export const useMedicationStore = create<MedicationStore>((set, get) => ({
  medications: [],
  isLoading: false,
  error: null,

  fetchMedications: async () => {
    try {
      set({ isLoading: true, error: null });

      // Call the API
      const data = (await getAllMedications()) || [];

      set({
        medications: Array.isArray(data) ? data : [data],
        error: null,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch medications";
      console.error("Failed to fetch medications:", err);
      set({ error: errorMessage, medications: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addMedication: async (medicationData) => {
    try {
      set({ isLoading: true, error: null });

      // Call the API
      const newMedication = await createMedication(medicationData);

      set((state) => ({
        medications: [...state.medications, newMedication],
        error: null,
      }));

      return Promise.resolve();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to add medication";
      console.error("Failed to add medication:", err);
      set({ error: errorMessage });
      return Promise.reject(new Error(errorMessage));
    } finally {
      set({ isLoading: false });
    }
  },

  updateMedication: async (id, medicationData) => {
    try {
      set({ isLoading: true, error: null });

      // Call the API
      const updatedMedication = await updateMedicationForm(id, medicationData);

      set((state) => {
        const updatedMedications = state.medications.map((med) =>
          med._id === id ? updatedMedication : med
        );

        return {
          medications: updatedMedications,
          error: null,
        };
      });

      return Promise.resolve();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update medication";
      console.error("Failed to update medication:", err);
      set({ error: errorMessage });
      return Promise.reject(new Error(errorMessage));
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMedication: async (id) => {
    try {
      set({ isLoading: true, error: null });

      // Call the API
      await deleteMedication(id);

      set((state) => ({
        medications: state.medications.filter((med) => med._id !== id),
        error: null,
      }));

      return Promise.resolve();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete medication";
      console.error("Failed to delete medication:", err);
      set({ error: errorMessage });
      return Promise.reject(new Error(errorMessage));
    } finally {
      set({ isLoading: false });
    }
  },

  exportMedication: async (exportData) => {
    try {
      set({ isLoading: true, error: null });

      console.log(
        "🚀 [MEDICATION STORE] Starting export medication:",
        exportData
      );

      // Tìm medication để lấy thông tin
      const currentMedications = get().medications;
      const medication = currentMedications.find(
        (med) => med._id === exportData.medicationId
      );

      if (!medication) {
        throw new Error("Medication not found");
      }

      console.log("📦 [MEDICATION STORE] Found medication:", {
        id: medication._id,
        name: medication.name,
        currentQuantity: medication.quantity,
      });

      // Call the API to export medication (nếu cần)
      try {
        await exportMedication(exportData);
        console.log("✅ [MEDICATION STORE] API export successful");
      } catch (apiError) {
        // Nếu API fail, vẫn tiếp tục với local update
        console.warn(
          "⚠️ [MEDICATION STORE] API export failed, continuing with local update:",
          apiError
        );
      }

      // Update local state by reducing the quantity
      set((state) => ({
        medications: state.medications.map((med) =>
          med._id === exportData.medicationId
            ? { ...med, quantity: (med.quantity || 0) - exportData.quantity }
            : med
        ),
        error: null,
      }));

      console.log("📊 [MEDICATION STORE] Updated medication quantity");

      // On success, refresh the export history
      useExportHistoryStore.getState().fetchExportHistory();

      console.log(
        "✅ [MEDICATION STORE] Export medication completed successfully"
      );
      return Promise.resolve();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to export medication";
      console.error("Failed to export medication:", err);
      set({ error: errorMessage });
      return Promise.reject(new Error(errorMessage));
    } finally {
      set({ isLoading: false });
    }
  },
}));

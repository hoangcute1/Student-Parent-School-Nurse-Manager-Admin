import { create } from "zustand";
import {
  getAllClasses,
  getClassById,
  getClassesByGrade,
} from "@/lib/api/class";
import { Class, ClassStore } from "@/lib/type/classes";

export const useClassStore = create<ClassStore>((set) => ({
  classes: [],
  isLoading: false,
  error: null,
  fetchClasses: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log("Fetching classes...");
      const classes = await getAllClasses();
      console.log("Classes response:", classes);

      set({
        classes,
        error: null,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch classes";
      console.error("Failed to fetch classes:", err);
      set({ error: errorMessage, classes: [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));

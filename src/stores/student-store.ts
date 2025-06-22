import { create } from "zustand";
import { StudentStore } from "@/lib/type/students";
import {
  getAllStudents,
  getStudentsByClass,
} from "@/lib/api/student";
import { useAuthStore } from "./auth-store";

export const useStudentStore = create<StudentStore>((set) => ({
  students: [],
  isLoading: false,
  error: null,
  selectedClassId: null,

  fetchStudents: async () => {
    try {
      set({ isLoading: true, error: null });

      // Check if user is authenticated and is a parent
      const { user } = useAuthStore.getState();

      if (!user || user.role !== "parent") {
        throw new Error("User not authenticated or not a parent");
      }

      const studentList = await getAllStudents();
      console.log("Students fetched:", studentList);

      set({
        students: studentList,
        error: null,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch students";
      console.error("Failed to fetch students:", err);
      set({ error: errorMessage, students: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStudentsByClass: async (classId: string) => {
    try {
      set({ isLoading: true, error: null, selectedClassId: classId });

      console.log(`Fetching students for class ${classId}`);

      const studentList = await getStudentsByClass(classId);
      console.log("Students fetched for class:", studentList);

      set({
        students: studentList,
        error: null,
      });
    } catch (err: any) {
      const errorMessage =
        err.message || `Failed to fetch students for class ${classId}`;
      console.error(`Failed to fetch students for class ${classId}:`, err);
      set({ error: errorMessage, students: [] });
    } finally {
      set({ isLoading: false });
    }
  },
  setSelectedClassId: (classId: string | null) => {
    set({ selectedClassId: classId });
  },
}));

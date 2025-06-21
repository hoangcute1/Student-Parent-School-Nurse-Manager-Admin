import { create } from "zustand";
import { Student } from "@/lib/type/students";
import { getStudentsForCurrentParent, getStudentHealthRecord } from "@/lib/api/student";
import { useAuthStore } from "./auth-store";

interface StudentStore {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
}

export const useStudentStore = create<StudentStore>((set) => ({
  students: [],
  isLoading: false,
  error: null,

  fetchStudents: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if user is authenticated and is a parent
      const { user } = useAuthStore.getState();
      
      if (!user || user.role !== "parent") {
        throw new Error("User not authenticated or not a parent");
      }
      
      console.log("Fetching students for current parent");
      
      const studentList = await getStudentsForCurrentParent();
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
}));

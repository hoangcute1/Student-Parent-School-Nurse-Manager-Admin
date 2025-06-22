import { getAuthToken, parseJwt } from "@/lib/api/auth/token";
import { getStudentsByParentId } from "@/lib/api/parent-students/parent-students";
import { StudentParentStore } from "@/lib/type/student-parent";
import { create } from "zustand";

export const useStudentParentStore = create<StudentParentStore>((set, get) => ({
  studentsData: [],
  isLoading: false,
  error: null,

  fetchStudentsByParent: async () => {
    try {
      set({ isLoading: true, error: null });

      const token = getAuthToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const user = parseJwt(token);
      console.log(user);

      if (!user || user.role !== "parent") {
        throw new Error("User not authenticated or not a parent");
      }

      const parentId = user.sub
      if (!parentId) throw new Error("Parent ID not found in token");

      const studentParentList = await getStudentsByParentId(parentId);
      console.log("Students fetched:", studentParentList);

      set({
        studentsData: studentParentList,
        error: null,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch students";
      console.error("Failed to fetch students:", err);
      set({ error: errorMessage, studentsData: [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));

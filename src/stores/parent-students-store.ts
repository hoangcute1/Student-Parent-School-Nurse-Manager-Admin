import { getAuthToken, parseJwt } from "@/lib/api/auth/token";
import {
  getStudentsByParentId,
  updateStudentByStudentId,
} from "@/lib/api/parent-students/parent-students";
import {
  getHealthExaminationsPending,
  approveHealthExamination,
  cancelHealthExamination,
} from "@/lib/api/health-examination";
import { EditHealthRecord } from "@/lib/type/health-record";
import {
  ParentStudents,
  ParentStudentsStore,
} from "@/lib/type/parent-students";
import { create } from "zustand";
import { fetchData } from "@/lib/api/api";

export const useParentStudentsStore = create<ParentStudentsStore>(
  (set, get) => ({
    studentsData: [],
    isLoading: false,
    error: null,
    selectedStudent: null,

    setSelectedStudent: (student) => {
      set({ selectedStudent: student });
    },

    fetchStudentsByParent: async () => {
      try {
        set({ isLoading: true, error: null });

        const token = getAuthToken();
        if (!token) {
          console.warn("No authentication token found");
          set({ isLoading: false, error: "User not authenticated" });
          return;
        }

        const user = parseJwt(token);
        console.log(user);

        if (!user || user.role !== "parent") {
          console.warn("User not authenticated or not a parent");
          set({
            isLoading: false,
            error: "User not authenticated or not a parent",
          });
          return;
        }

        const parentId = user.sub;
        if (!parentId) {
          console.warn("Parent ID not found in token");
          set({ isLoading: false, error: "Parent ID not found in token" });
          return;
        }

        const studentParentList = await getStudentsByParentId(parentId);
        console.log("Students fetched:", studentParentList);

        set({
          studentsData: studentParentList,
          error: null,
          // Tự động chọn học sinh đầu tiên nếu chưa có học sinh nào được chọn
          selectedStudent:
            get().selectedStudent || studentParentList[0] || null,
        });
      } catch (err: any) {
        const errorMessage = err.message || "Failed to fetch students";
        console.error("Failed to fetch students:", err);
        set({ error: errorMessage, studentsData: [] });
      } finally {
        set({ isLoading: false });
      }
    },

    updateStudent: async (
      studentId: string,
      studentData: Partial<EditHealthRecord>
    ) => {
      try {
        set({ isLoading: true, error: null });

        const updatedStudent = await updateStudentByStudentId(
          studentId,
          studentData
        );
        console.log("Student updated:", updatedStudent);

        // Optionally, refetch students after update

        set({
          error: null,
        });
      } catch (err: any) {
        const errorMessage = err.message || "Failed to update student";
        console.error("Failed to update student:", err);
        set({ error: errorMessage });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchHealthExaminationResults: async (studentId: string) => {
      try {
        const response = await fetchData<any>(
          `/health-examinations/student/${studentId}/completed`
        );

        if (response) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      } catch (error) {
        console.error("Error fetching health examination results:", error);
        throw error;
      }
    },

    fetchHealthExaminationsPending: async (studentId: string): Promise<any> => {
      try {
        const results = await getHealthExaminationsPending(studentId);
        console.log("Health examinations pending:", results);
        return results;
      } catch (error) {
        console.error("Error fetching health examinations pending:", error);
        throw error;
      }
    },

    approveHealthExamination: async (
      studentId: string,
      examinationId: string
    ): Promise<{ success: boolean; message: string }> => {
      try {
        const result = await approveHealthExamination(studentId, examinationId);
        console.log("Health examination approved:", result);
        return result;
      } catch (error) {
        console.error("Error approving health examination:", error);
        throw error;
      }
    },

    cancelHealthExamination: async (
      studentId: string,
      examinationId: string
    ): Promise<{ success: boolean; message: string }> => {
      try {
        const result = await cancelHealthExamination(studentId, examinationId);
        console.log("Health examination cancelled:", result);
        return result;
      } catch (error) {
        console.error("Error cancelling health examination:", error);
        throw error;
      }
    },
  })
);

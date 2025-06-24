import { create } from "zustand";
import { CreateStudentData, Student, StudentStore, UpdateStudentData } from "@/lib/type/students";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  getStudentsByClass,
  updateStudent,
} from "@/lib/api/student";
import { useAuthStore } from "./auth-store";

export const useStudentStore = create<StudentStore>((set) => ({
  students: [],
  isLoading: false,
  error: null,
  selectedClassId: null,
  selectedStudent: null,
  selectedStudentId: null,

  fetchStudents: async () => {
    try {
      set({ isLoading: true, error: null });

      // Check if user is authenticated and is a parent
      const { user } = useAuthStore.getState();

      // if (!user || user.role !== "parent") {
      //   throw new Error("User not authenticated or not a parent");
      // }

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

  deleteStudent: async (id: string) => {
    try {
      set({ isLoading: true, error: null });  
      await deleteStudent(id);
      set((state) => ({ students: state.students.filter((student) => student.student._id !== id) }));
      console.log(`Student with ID ${id} deleted successfully`);
    } catch (err: any) {
      const errorMessage = err.message || `Failed to delete student with ID ${id}`;
      console.error(`Failed to delete student with ID ${id}:`, err);
      set({ error: errorMessage });
    }
  },

  updateStudent: async (id: string, studentData: Partial<UpdateStudentData>) => {
    try {
      set({ isLoading: true, error: null });
      const updatedStudent = await updateStudent(id, studentData);
      set((state) => ({
        students: state.students.map((student) =>
          student.student._id === id ? { ...student, ...updatedStudent } : student
        ),
      }));
      console.log(`Student with ID ${id} updated successfully`);
    }
    catch (err: any) {
      const errorMessage = err.message || `Failed to update student with ID ${id}`;
      console.error(`Failed to update student with ID ${id}:`, err);
      set({ error: errorMessage });
    }
    finally {
      set({ isLoading: false });
    }
  },


  fetchStudentById: async (id: string) => {
  try {
    set({ isLoading: true, error: null });
    console.log(`Fetching student with ID ${id}`);
    const student = await getStudentById(id);
    set({
      selectedStudentId: student,
      error: null,
    });
  } catch (err: any) {
    const errorMessage = err.message || `Failed to fetch student with ID ${id}`;
    console.error(`Failed to fetch student with ID ${id}:`, err);
    set({ error: errorMessage });
  } finally {
    set({ isLoading: false });
  }
},
  createStudent: async (studentData: Partial<CreateStudentData>) => {
    try {
      set({ isLoading: true, error: null });
      const newStudent = await createStudent(studentData);
      set((state) => ({
        students: [...state.students, newStudent],
      }));
      console.log("New student created successfully:", newStudent);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create student";
      console.error("Failed to create student:", err);
      set({ error: errorMessage });
    }
  finally {
    set({ isLoading: false });
  }
  },


}));

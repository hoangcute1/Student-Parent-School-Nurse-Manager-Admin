import {
  Student,
  StudentParentResponse,
  StudentResponse,
} from "@/lib/type/students";
import { fetchData } from "../api";


/**
 * Get a student by ID
 */
export const getStudentById = async (id: string): Promise<Student> => {
  try {
    return await fetchData<Student>(`/students/${id}`);
  } catch (error) {
    console.error(`Error fetching student with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get all students
 */
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const response = await fetchData<StudentResponse>(`/students`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching all students:", error);
    throw error;
  }
};

/**
 * Get students by class ID
 */
export const getStudentsByClass = async (
  classId: string
): Promise<Student[]> => {
  try {
    const response = await fetchData<StudentResponse>(
      `/students/class/${classId}`
    );
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching students for class ${classId}:`, error);
    throw error;
  }
};

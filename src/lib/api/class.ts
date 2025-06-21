import { Class, ClassResponse } from "../type/classes";
import { fetchData } from "./api";

/**
 * Get all classes
 */
export const getAllClasses = async (): Promise<Class[]> => {
  try {
    const response = await fetchData<ClassResponse>("/classes");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

/**
 * Get a class by ID
 */
export const getClassById = async (id: string): Promise<Class> => {
  try {
    return await fetchData<Class>(`/classes/${id}`);
  } catch (error) {
    console.error(`Error fetching class with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get classes by grade
 */
export const getClassesByGrade = async (grade: string): Promise<Class[]> => {
  try {
    const response = await fetchData<ClassResponse>(`/classes/grade/${grade}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching classes for grade ${grade}:`, error);
    throw error;
  }
};

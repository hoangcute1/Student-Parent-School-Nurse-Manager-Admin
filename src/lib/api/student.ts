import { HealthRecord, Student, StudentResponse } from "../type/students";

import { fetchData } from "./api";

/**
 * Get all students for the current authenticated parent
 */
export const getStudentsForCurrentParent = async (): Promise<Student[]> => {
  try {
    const response = await fetchData<StudentResponse>(`/students/me`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching students for current parent:", error);
    throw error;
  }
};

/**
 * Get all students for a specific parent ID
 */
export const getStudentsByParentId = async (
  parentId: string
): Promise<Student[]> => {
  try {
    const response = await fetchData<StudentResponse>(
      `/students/parent/${parentId}`
    );
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching students for parent ${parentId}:`, error);
    throw error;
  }
};

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

/**
 * Get health records for a student
 */
export const getStudentHealthRecord = async (
  studentId: string
): Promise<HealthRecord> => {
  try {
    return await fetchData<HealthRecord>(
      `/health-records/student/${studentId}`
    );
  } catch (error) {
    console.error(
      `Error fetching health record for student ${studentId}:`,
      error
    );
    throw error;
  }
};

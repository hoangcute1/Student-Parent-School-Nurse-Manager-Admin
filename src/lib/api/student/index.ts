import { create } from 'zustand';
import {
  CreateStudentData,
  Student,
  StudentParentResponse,
  StudentResponse,
  UpdateStudentData,
  ViewStudent,
} from "@/lib/type/students";
import { fetchData } from "../api";
import { Update } from 'next/dist/build/swc/types';


/** 
 * Get a student by ID
 */
export const getStudentById = async (id: string): Promise<ViewStudent> => {
  try {
    return await fetchData<ViewStudent>(`/students/${id}`);
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






export const deleteStudent = async (id: string): Promise<void> => {
  try {
    await fetchData(`/students/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Error deleting student with ID ${id}:`, error);
    throw error;
  }
};

export const updateStudent = async (
  id: string,
  studentData: Partial<UpdateStudentData> 
): Promise<any> => {
  try {
    const response = await fetchData<UpdateStudentData>(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(studentData),
    });
    return response;
  } catch (error) {
    console.error(`Error updating student with ID ${id}:`, error);
    throw error;
  }
};


export const createStudent = async (
  studentData: Partial<CreateStudentData>
): Promise<any> => {
  try { 
    const response = await fetchData<CreateStudentData>("/students", {
      method: "POST",
      body: JSON.stringify(studentData),
    });
    return response;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
};
import { create } from "zustand";
import {
  CreateStudentData,
  Student,
  StudentResponse,
  UpdateStudentData,
  ViewStudent,
} from "@/lib/type/students";
import { fetchData } from "../api";
import { Update } from "next/dist/build/swc/types";
import { getAuthToken } from "../auth/token";

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
  const token = getAuthToken();
  console.log("Token:", token);
  const res = await fetch("http://localhost:3001/students", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return json.data; // ✅ trả về mảng
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

/**
 * Get a student by ID with parent information
 */
export const getStudentWithParent = async (id: string): Promise<any> => {
  const token = getAuthToken();
  console.log("Getting student with parent, ID:", id);

  const res = await fetch(`http://localhost:3001/students/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }

  return res.json();
};

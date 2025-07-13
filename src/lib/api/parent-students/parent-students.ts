import { ParentStudents } from "@/lib/type/parent-students";
import { fetchData } from "../api";
import { EditHealthRecord } from "@/lib/type/health-record";

export const getStudentsByParentId = async (
  userId: string
): Promise<ParentStudents[]> => {
  try {
    const response = await fetchData<ParentStudents[]>(
      `/parent-students/parent/${userId}`
    );
    return response || [];
  } catch (error) {
    console.error(`Error fetching students for parent ${userId}:`, error);
    throw error;
  }
};

export const updateStudentByStudentId = async (
  studentId: string,
  studentData: Partial<EditHealthRecord>
): Promise<any> => {
  try {
    const response = await fetchData<EditHealthRecord>(
      `health-records/student/${studentId}`,
      {
        method: "PUT",
        body: JSON.stringify(studentData),
      }
    );
    return response;
  } catch (error) {
    console.error(`Error updating student with ID ${studentId}:`, error);
    throw error;
  }
};

export const createParentStudentByEmail = async (
  parentEmail: string,
  studentId: string
): Promise<any> => {
  try {
    const response = await fetchData(`/parent-students/by-email`, {
      method: "POST",
      body: JSON.stringify({ parentEmail, studentId }),
    });
    return response;
  } catch (error) {
    console.error(`Error creating parent-student by email:`, error);
    throw error;
  }
};

import { StudentParentResponse } from "@/lib/type/students";
import { fetchData } from "../api";

export const getStudentsByParentId = async (
  parentId: string
): Promise<StudentParentResponse[]> => {
  try {
    const response = await fetchData<StudentParentResponse[]>(
      `/parent-students/parent/${parentId}`
    );
    return response || [];
  } catch (error) {
    console.error(`Error fetching students for parent ${parentId}:`, error);
    throw error;
  }
};

import { ParentStudents } from "@/lib/type/parent-students";
import { fetchData } from "../api";

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

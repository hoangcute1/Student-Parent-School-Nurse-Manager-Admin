import { HealthRecord, Student, StudentResponse } from "@/lib/type/students";
import { fetchData } from "../api";

export const getAllStudents = (
  page: number = 1,
  pageSize: number = 10
): Promise<StudentResponse> => {
  return fetchData<StudentResponse>(
    `/students?page=${page}&pageSize=${pageSize}`
  );
};

export const getStudentById = (id: string): Promise<Student> => {
  return fetchData<Student>(`/children/${id}`);
};

// Get health record by child ID
export const getHealthRecordByChildId = (
  childId: string
): Promise<HealthRecord> => {
  return fetchData<HealthRecord>(`/health-records/${childId}`);
};
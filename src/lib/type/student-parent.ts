import { Student, StudentParentResponse } from "./students";

interface StudentParentStore {
  studentsData: StudentParentResponse[];
  isLoading: boolean;
  error: string | null;
  fetchStudentsByParent: () => Promise<void>;
}

export type { StudentParentStore };

interface Student {
  _id: string;
  name: string;
  studentId: string;
  birth?: string;
  gender?: string;
  grade?: string;
  class?: {
    _id: string;
    name: string;
    grade: string;
  };
  parentId?: string;
  created_at: string;
  updated_at: string;
}
interface StudentResponse {
  data: Student[];
  total: number;
  page: number;
  limit: number;
}

interface StudentParentResponse {
  _id: string;
  name: string;
  parent: string;
  student: {
    _id: string;
    studentId: string;
    name: string;
    birth: string;
    gender: string;
    class: {
      _id: string;
      name: string;
    };
  };
  created_at: string;
  updated_at: string;
}
interface StudentStore {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  selectedClassId: string | null;
  fetchStudents: () => Promise<void>;
  fetchStudentsByClass: (classId: string) => Promise<void>;
  setSelectedClassId: (classId: string | null) => void;
}

export type { Student, StudentResponse, StudentStore, StudentParentResponse };

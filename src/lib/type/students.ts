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
  parent?: {
    _id: string;
    user: string;
  };
  created_at: string;
  updated_at: string;
}

interface CreateStudentData {
  name: string;
  studentId: string;
  birth?: string;
  gender?: string;
  classId?: string;
  parentId?: string;
}


interface UpdateStudentData {
  name: string;
  studentId: string;
  birth?: string;
  gender?: string;
  classId?: string;
  parentId?: string;
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
  selectedStudent: Student | null;

  fetchStudents: () => Promise<void>;
  fetchStudentsByClass: (classId: string) => Promise<void>;
  setSelectedClassId: (classId: string | null) => void;
  deleteStudent: (id: string) => Promise<void>;
  updateStudent: (id: string, studentData: Partial<UpdateStudentData>) => Promise<void>;
  fetchStudentById: (id: string) => Promise<void>;
  createStudent: (studentData: Partial<CreateStudentData>) => Promise<void>;
}

export type { Student, StudentResponse, StudentStore, StudentParentResponse, CreateStudentData, UpdateStudentData };

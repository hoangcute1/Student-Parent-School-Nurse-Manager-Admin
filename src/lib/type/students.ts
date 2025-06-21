export type HealthRecord = {
  _id: string;
  allergies: string | null;
  chronic_diseases: string | null;
  chronic_conditions: string;
  treatment_history: string;
  vision: string;
  notes: string;
  student_id: {
    _id: string;
    name: string;
    studentId: string;
    birth: string;
    gender: string;
    grade: string;
    class: string;
  };
};

export interface Student {
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
  createdAt: string;
  updatedAt: string;
}

export interface StudentResponse {
  data: Student[];
  total: number;
  page: number;
  limit: number;
}
export interface HealthRecordResponse {
  data: HealthRecord[];
  total: number;
  page: number;
  limit: number;
}

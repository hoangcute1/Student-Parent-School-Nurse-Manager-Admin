

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


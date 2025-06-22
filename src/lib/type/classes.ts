export interface Class {
  _id: string;
  name: string;
  grade: string;
  academic_year: string;
  teacherId?: string;
  students_count?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassResponse {
  data: Class[];
  total: number;
  page: number;
  limit: number;
}

export interface ClassStore {
  classes: Class[];
  isLoading: boolean;
  error: string | null;
  fetchClasses: () => Promise<void>;
}

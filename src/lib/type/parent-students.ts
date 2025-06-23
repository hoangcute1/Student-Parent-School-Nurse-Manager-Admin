import { Parent } from "@/lib/type/parents";
import { Student } from "./students";
import { HealthRecord } from "./health-record";



interface ParentStudents {
  _id: string;
  parent: Parent;
  student: Student;
  healthRecord: HealthRecord;
}
interface ParentData extends Parent {}
interface StudentData extends Student {}
interface ParentStudentHealthRecord extends HealthRecord {}

interface ParentStudentTableRow {
  data: StudentData[];
  total: number;
  page: number;
  limit: number;
}

interface ParentStudentsStore {
  studentsData: ParentStudents[];
  isLoading: boolean;
  error: string | null;
  fetchStudentsByParent: () => Promise<void>;
}

interface GetAllParentsResponse {
  data: ParentStudents[];
  total: number;
  page: number;
  limit: number;
}

interface UpdateParentStudentForm
  extends Partial<
    Omit<
      StudentData & ParentStudentHealthRecord,
      "_id" | "created_at" | "updated_at"
    >
  > {}

export type {
  ParentStudents,
  ParentData,
  StudentData,
  ParentStudentHealthRecord,
  ParentStudentTableRow,
  ParentStudentsStore,
  GetAllParentsResponse,
  UpdateParentStudentForm,
};

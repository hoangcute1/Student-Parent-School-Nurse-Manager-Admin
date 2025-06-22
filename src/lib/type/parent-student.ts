import { Parent } from "@/lib/type/parents";
import { Student } from "./students";
import { HealthRecord } from "@/lib/type/health-record";
import { ParentStudentFormValues } from "@/app/dashboard/health-declaration/_components/add-parent-student-dialog";

interface ParentStudent {
  _id: string;
  parent: Parent;
  student: Student;
  health_record: HealthRecord;
}
interface ParentStore extends Parent {}
interface StudentStore extends Student {}
interface ParentStudentHealthRecord extends HealthRecord {}

interface ParentStudentTableRow {
  data: StudentStore[];
  total: number;
  page: number;
  limit: number;
}

interface ParentStudentStore {
  parentStudents: ParentStudent[];
  isLoading: boolean;
  error: string | null;
  fetchParentStudents: () => Promise<void>;
  addParentStudent: (data: ParentStudentFormValues) => Promise<void>;
}

interface GetAllParentsResponse {
  data: ParentStudent[];
  total: number;
  page: number;
  limit: number;
}

interface UpdateParentStudentForm
  extends Partial<
    Omit<
      StudentStore & ParentStudentHealthRecord,
      "_id" | "created_at" | "updated_at"
    >
  > {}

export type {
  ParentStudent,
  ParentStore,
  StudentStore,
  ParentStudentHealthRecord,
  ParentStudentTableRow,
  ParentStudentStore,
  GetAllParentsResponse,
  UpdateParentStudentForm,
};

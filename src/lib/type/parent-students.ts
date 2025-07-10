import { Parent } from "@/lib/type/parents";
import { Student } from "./students";
import { EditHealthRecord, HealthRecord } from "./health-record";
import { HealthExaminationPending } from "@/lib/api/health-examination";

interface ParentStudents {
  student: {
    _id: string;
    studentId: string;
    name: string;
    birth: Date;
    gender: string;
    class: {
      _id: string;
      name: string;
    };
  };
  parent: {
    _id: string;
    user: string;
  };
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
  selectedStudent: ParentStudents | null;
  setSelectedStudent: (student: ParentStudents | null) => void;
  fetchStudentsByParent: () => Promise<void>;
  updateStudent: (
    studentId: string,
    studentData: Partial<EditHealthRecord>
  ) => Promise<void>;
  fetchHealthExaminationResults: (studentId: string) => Promise<any>;
  fetchHealthExaminationsPending: (
    studentId: string
  ) => Promise<HealthExaminationPending>;
  approveHealthExamination: (
    studentId: string,
    examinationId: string
  ) => Promise<{ success: boolean; message: string }>;
  cancelHealthExamination: (
    studentId: string,
    examinationId: string
  ) => Promise<{ success: boolean; message: string }>;
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

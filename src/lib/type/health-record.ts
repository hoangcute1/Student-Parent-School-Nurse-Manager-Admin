interface HealthRecord {
  _id: string;
  allergies: string[];
  medications: string[];
  height: string;
  weight: string;
  vision: string;
  hearing: string;
  blood_type: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
}
interface HealthRecordFormValues {
  allergies: string[];
  medications: string[];
  height: string;
  weight: string;
  vision: string;
  hearing: string;
  blood_type: string;
  notes: string;
}
interface HealthRecordStore {
  healthRecords: HealthRecord[];
  isLoading: boolean;
  error: string | null;
  fetchHealthRecords: () => Promise<void>;
  addHealthRecord: (data: HealthRecordFormValues) => Promise<void>;
  updateHealthRecord: (
    id: string,
    data: HealthRecordFormValues
  ) => Promise<void>;
  deleteHealthRecord: (id: string) => Promise<void>;
}
interface GetAllHealthRecordsResponse {
  data: HealthRecord[];
  total: number;
  page: number;
  limit: number;
}
interface UpdateHealthRecordForm
  extends Partial<Omit<HealthRecord, "_id" | "created_at" | "updated_at">> {}
interface UpdateHealthRecordResponse {
  message: string;
  healthRecord: HealthRecord;
}
export type {
  HealthRecord,
  HealthRecordFormValues,
  HealthRecordStore,
  GetAllHealthRecordsResponse,
  UpdateHealthRecordResponse,
  UpdateHealthRecordForm,
};

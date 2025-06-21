export interface HealthRecord {
  _id: string;
  allergies: string[];
  chronic_conditions: string[];
  height: number;
  weight: number;
  vision: string;
  hearing: string;
  blood_type: string;
  treatment_history: string[];
  notes: string;
  created_at?: string;
  updated_at?: string;
  student?: {
    _id: string;
    studentId: string;
    name: string;
    class: string;
  };
}

export interface HealthRecordFormValues {
  allergies: string[];
  chronic_conditions: string[];
  height: number;
  weight: number;
  vision: string;
  hearing: string;
  blood_type: string;
  treatment_history: string[];
  notes: string;
  student_id: string;
}

export interface HealthRecordStore {
  records: HealthRecord[];
  isLoading: boolean;
  error: string | null;
  fetchRecords: () => Promise<void>;
  addRecord: (data: HealthRecordFormValues) => Promise<void>;
}

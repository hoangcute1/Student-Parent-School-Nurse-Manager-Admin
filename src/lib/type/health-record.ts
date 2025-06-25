interface HealthRecord {
  _id: string;
  allergies: string;
  chronic_conditions: string;
  height: string;
  weight: string;
  vision: string;
  hearing: string;
  blood_type: string;
  treatment_history: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
  student?: {
    _id: string;
  };
}

interface EditHealthRecord {
  allergies: string;
  chronic_conditions: string;
  height: string;
  weight: string;
  vision: string;
  hearing: string;
  blood_type: string;
  treatment_history: string;
  notes: string;
}

export type { HealthRecord, EditHealthRecord };

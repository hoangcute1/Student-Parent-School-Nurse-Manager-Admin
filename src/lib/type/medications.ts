// Re-export the Medication interface from the API for consistency

// FormValues type used by medication forms
export interface Medication {
  name: string;
  dosage: string;
  unit: string;
  type?: string;
  usage_instructions: string;
  side_effects: string;
  contraindications: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}
export interface MedicationListResponse {
  data: Medication[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

// Response types for API
export interface GetAllMedicationsResponse {
  data: Medication[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateMedicationResponse {
  message: string;
  medication: Medication;
}

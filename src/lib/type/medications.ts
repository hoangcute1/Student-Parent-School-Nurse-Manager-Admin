// Re-export the Medication interface from the API for consistency

// FormValues type used by medication forms
export interface Medication {
  _id: string;
  name: string;
  dosage: string;
  quantity?: number;
  unit: string;
  type?: string;
  usage_instructions: string;
  side_effects: string;
  contraindications: string;
  description?: string;
  manufacturer?: string;
  image: string;
  is_prescription_required: false | true; // Assuming this is a boolean field,
  createdAt?: Date;
  updatedAt?: Date;
}

// Response types for API
export interface MedicationFormValues {
  name: string;
  dosage: string;
  quantity?: number | string;
  unit: string;
  type?: string;
  usage_instructions: string;
  side_effects: string;
  contraindications: string;
  description?: string;
  manufacturer?: string;
  image?: string;
  is_prescription_required: boolean;
}

export interface UpdateMedicationResponse {
  message: string;
  medication: Medication;
}

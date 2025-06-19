






export interface Child {
  id: string;
  name: string;
  dob: string;
  gender: "male" | "female";
  grade: string;
  class: string;
  parentId: string;
  healthRecordId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecord {
  id: string;
  childId: string;
  basicInfo: {
    height: number;
    weight: number;
    bloodType?: string;
    rhFactor?: "positive" | "negative";
    vision: "normal" | "myopia" | "hyperopia" | "astigmatism" | "other";
    hearing: "normal" | "mild_loss" | "moderate_loss" | "severe_loss" | "other";
  };
  medicalHistory: {
    chronicDiseases: string[];
    chronicDetails?: string;
    medications?: string;
  };
  allergies: {
    food?: string[];
    medications?: string[];
    other?: string[];
    details?: string;
    emergencyMedication?: string;
  };
  vaccinations: Array<{
    id: string;
    vaccine: string;
    date: string;
    location: string;
    administered: boolean;
  }>;
  lastUpdated: string;
}

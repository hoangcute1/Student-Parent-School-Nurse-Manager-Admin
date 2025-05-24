// Models for the School Health Management System

import { RoleName } from "./roles";

// User model
export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  password?: string;
}

// Child model
export interface Child {
  id: string;
  name: string;
  dob: string;
  gender: "male" | "female";
  grade: string;
  class: string;
  parentId: string; // Reference to parent user
  healthRecordId?: string; // Reference to health record
}

// Health Record model
export interface HealthRecord {
  id: string;
  childId: string; // Reference to child
  basicInfo: {
    height: number; // in cm
    weight: number; // in kg
    bloodType?: "A" | "B" | "AB" | "O" | "unknown";
    rhFactor?: "positive" | "negative" | "unknown";
    vision?: "normal" | "myopia" | "hyperopia" | "astigmatism" | "other";
    hearing?:
      | "normal"
      | "mild_loss"
      | "moderate_loss"
      | "severe_loss"
      | "other";
  };
  medicalHistory: {
    chronicDiseases?: string[]; // e.g., "asthma", "diabetes", etc.
    chronicDetails?: string;
    medications?: string;
  };
  allergies: {
    food?: string[]; // e.g., "peanuts", "seafood", etc.
    medications?: string[]; // e.g., "penicillin", "aspirin", etc.
    other?: string[]; // e.g., "pollen", "dust", etc.
    details?: string;
    emergencyMedication?: string;
  };
  vaccinations: VaccinationRecord[];
  lastUpdated: string; // ISO date string
  updatedBy: string; // User ID who last updated
}

// Vaccination Record model
export interface VaccinationRecord {
  id: string;
  vaccine: string; // Name of vaccine
  date: string; // Date of vaccination
  location: string; // Where it was administered
  administered: boolean; // Whether it's been administered or just planned
  reaction?: string; // Any reaction to the vaccine
}

// Event model for health events at school
export interface HealthEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: "checkup" | "vaccination" | "workshop" | "other";
  targetGrades?: string[]; // Which grades this is targeted at
  createdBy: string; // User ID who created the event
}

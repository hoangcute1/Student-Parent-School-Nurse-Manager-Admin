import { Student } from './../schemas/student.schema';
export enum CampaignStatus {
  PENDING = 'pending',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum CampaignType {
  VACCINE = 'VaccineCampaign',
  PERIODIC = 'PeriodicCampaign',
  HEALTH_EXAMINATION = 'HealthExamination',
}

export enum StudentCampaignStatus {
  INCOMPLETED = 'incompleted',
  COMPLETED = 'completed',
}

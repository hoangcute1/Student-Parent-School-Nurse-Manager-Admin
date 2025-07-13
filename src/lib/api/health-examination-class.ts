import { fetchData } from "./api";
import { getAuthToken } from "./auth/token";

export interface Student {
  examination_id: string;
  student: {
    _id: string;
    full_name: string;
    student_id: string;
    email?: string;
    phone?: string;
  };
  status: string;
  parent_response_notes?: string;
  rejection_reason?: string;
  health_result?: string;
  recommendations?: string;
  follow_up_required?: boolean;
  examination_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ClassDetail {
  event_id: string;
  class_id: string;
  class_info: {
    name: string;
    grade_level: number;
    teacher?: string;
  };
  event_details: {
    title: string;
    examination_date: string;
    examination_time: string;
    location: string;
    examination_type: string;
  };
  statistics: {
    total_students: number;
    approved: number;
    pending: number;
    rejected: number;
    completed: number;
  };
  students: Student[];
}

export const getHealthExaminationClassDetail = async (
  eventId: string,
  classId: string
): Promise<ClassDetail> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetchData<any>(
    `/health-examinations/events/${encodeURIComponent(
      eventId
    )}/classes/${classId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response) {
    throw new Error(`Failed to fetch class detail: ${response.status}`);
  }

  return response;
};

export const updateHealthExaminationResult = async (
  examinationId: string,
  examinationData: any
): Promise<any> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `/api/health-examinations/${examinationId}/result`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(examinationData),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update examination result: ${response.status}`);
  }

  return response.json();
};

export const scheduleConsultation = async (
  studentId: string,
  consultationDate: string,
  consultationTime: string,
  notes: string
): Promise<any> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `/api/health-examinations/schedule-consultation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        student_id: studentId,
        consultation_date: consultationDate,
        consultation_time: consultationTime,
        notes: notes,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to schedule consultation: ${response.status}`);
  }

  return response.json();
};

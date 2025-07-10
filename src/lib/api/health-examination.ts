import { fetchData } from "./api";
import { getAuthToken } from "./auth/token";

export interface HealthExaminationPending {
  _id: string;
  name: string;
  description: string;
  date: string;
  type: string;
  status: "pending" | "completed" | "cancelled";
  class: {
    _id: string;
    name: string;
  };
  student: {
    _id: string;
    studentId: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface HealthExaminationCompleted {
  _id: string;
  title: string;
  description: string;
  examination_date: string;
  examination_time: string;
  location: string;
  doctor_name?: string;
  examination_type: string;
  health_result?: string;
  examination_notes?: string;
  recommendations?: string;
  follow_up_required?: boolean;
  created_at: string;
  updated_at: string;
  student_id: {
    _id: string;
    full_name: string;
    student_id: string;
  };
  created_by: {
    _id: string;
    full_name: string;
  };
}

export const getHealthExaminationsPending = async (
  studentId: string
): Promise<any> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetchData(
    `/health-examinations/student/${studentId}/pending`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response) {
    throw new Error(`HTTP error! status: ${response}`);
  }

  return response;
};

export const getHealthExaminationsCompleted = async (
  studentId: string
): Promise<HealthExaminationCompleted[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetchData<HealthExaminationCompleted[]>(
    `/health-examinations/student/${studentId}/completed`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response) {
    throw new Error(`HTTP error! status: ${response}`);
  }

  return response;
};

export const approveHealthExamination = async (
  studentId: string,
  examinationId: string
): Promise<{ success: boolean; message: string }> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetchData<any>(
    `/health-examinations/student/${studentId}/examination/${examinationId}/approve`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Transform backend response to match expected format
  return {
    success: true,
    message: response.message || "Đã phê duyệt lịch khám sức khỏe",
  };
};

export const cancelHealthExamination = async (
  studentId: string,
  examinationId: string
): Promise<{ success: boolean; message: string }> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetchData<any>(
    `health-examinations/student/${studentId}/examination/${examinationId}/cancel`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Transform backend response to match expected format
  return {
    success: true,
    message: response.message || "Đã hủy lịch khám sức khỏe",
  };
};

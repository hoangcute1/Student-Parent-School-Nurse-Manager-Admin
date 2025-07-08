export interface TreatmentHistory {
  _id: string;
  title: string;
  student: string | {
    _id: string;
    name: string;
    studentId: string;
    class?: string;
  };
  class?: string;
  location: string;
  priority: string;
  description: string;
  contactStatus: string;
  reporter?: string;
  status?: "processing" | "resolved" | "pending";
  notes?: string;
  contactParent?: boolean;
  actionTaken?: string;
  createdAt?: string;
  updatedAt?: string;
  // Thêm các trường khác nếu backend trả về
}
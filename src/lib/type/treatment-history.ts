export interface TreatmentHistory {
  _id: string;
  student: string | {
    _id: string;
    name: string;
    studentId: string;
    class?: string;
  };
  staff: string; // Nhân viên xử lý (required)
  record: string; // Bản ghi y tế (required)
  date: string; // Ngày tạo sự kiện (required)
  description: string; // Mô tả (required)
  notes?: string; // Ghi chú (optional)
  createdAt?: string;
  updatedAt?: string;

  // Các trường legacy (để tương thích với UI hiện tại)
  title?: string;
  class?: string;
  location?: string;
  priority?: string;
  contactStatus?: string;
  reporter?: string;
  status?: "processing" | "resolved" | "pending";
  contactParent?: boolean;
  actionTaken?: string;
}
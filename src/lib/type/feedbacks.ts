export interface Feedback {
  id: number;
  author: string;
  authorType: "parent" | "student" | "staff";
  studentClass?: string;
  content: string;
  rating: number;
  type: "positive" | "negative" | "suggestion";
  status: "new" | "processing" | "resolved";
  response?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateFeedbackDTO = Omit<Feedback, "id" | "createdAt" | "updatedAt" | "status">;
export type UpdateFeedbackDTO = Partial<Omit<Feedback, "id" | "createdAt" | "updatedAt">>;

export interface FeedbackResponse {
  data: Feedback[];
  total: number;
  page: number;
  pageSize: number;
}

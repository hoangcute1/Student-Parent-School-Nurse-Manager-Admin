export interface Feedback {
  _id: string;
  childId: string;
  parent: string;
  title: string;
  description: string;
  response: string;
}

export interface FeedbackResponse {
  data: Feedback[];
  total: number;
}

export interface FeedbackStore {
  feedbacks: Feedback[];
  isLoading: boolean;
  error: string | null;
  total: number;
  fetchFeedbacks: () => Promise<void>;
  createFeedback: (data: CreateFeedbackParams) => Promise<void>;
  updateFeedback: (id: string, data: UpdateFeedbackParams) => Promise<void>;
  deleteFeedback: (id: string) => Promise<void>;
  resetError: () => void;
}

export interface CreateFeedbackParams {
  childId: string;
  parent: string;
  title: string;
  description: string;
  response?: string;
}

export interface UpdateFeedbackParams {
  title?: string;
  description?: string;
  response?: string;
}

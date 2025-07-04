export interface Feedback {
  _id: string;
  parent:
    | string
    | {
        _id: string;
        email: string;
        [key: string]: any;
      };
  title: string;
  description: string;
  response: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackResponse {
  feedbacks: Feedback[];
  data?: Feedback[];
  total?: number;
}

export interface FeedbackStore {
  feedbacks: Feedback[];
  isLoading: boolean;
  error: string | null;
  total: number;
  fetchFeedbacks: (useNoAuth?: boolean) => Promise<void>;
  createFeedback: (data: CreateFeedbackParams) => Promise<void>;
  updateFeedback: (id: string, data: UpdateFeedbackParams) => Promise<void>;
  processFeedback: (id: string) => Promise<void>;
  updateFeedbackResponse: (
    id: string,
    data: { response: string; responderId: string }
  ) => Promise<void>;
  deleteFeedback: (id: string) => Promise<void>;
  resetError: () => void;
}

export interface CreateFeedbackParams {
  parent: string;
  title: string;
  description: string;
}

export interface UpdateFeedbackParams {
  title?: string;
  description?: string;
  response?: string;
}

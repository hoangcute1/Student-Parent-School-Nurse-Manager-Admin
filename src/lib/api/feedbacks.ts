import {
  Feedback,
  FeedbackResponse,
  CreateFeedbackParams,
  UpdateFeedbackParams,
} from "../type/feedbacks";
import { fetchData } from "./api";

// Get all feedbacks
export const getFeedbacks = async (): Promise<FeedbackResponse> => {
  return fetchData<FeedbackResponse>("/feedbacks", {
    method: "GET",
  });
};

// Create a new feedback
export const createFeedback = async (
  data: CreateFeedbackParams
): Promise<Feedback> => {
  return fetchData<Feedback>("/feedbacks", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing feedback
export const updateFeedback = async (
  id: string,
  data: UpdateFeedbackParams
): Promise<Feedback> => {
  return fetchData<Feedback>(`/feedbacks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// Delete a feedback
export const deleteFeedback = async (id: string): Promise<void> => {
  return fetchData<void>(`/feedbacks/${id}`, {
    method: "DELETE",
  });
};

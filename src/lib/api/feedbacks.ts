import {
  CreateFeedbackParams,
  Feedback,
  FeedbackResponse,
  UpdateFeedbackParams,
} from "../../type/feedbacks";
import { fetchData } from "./api";

export const getFeedbacks = (): Promise<FeedbackResponse> => {
  return fetchData<FeedbackResponse>(`/feedbacks`);
};

export const getFeedbackById = (id: string): Promise<Feedback> => {
  return fetchData<Feedback>(`/feedbacks/${id}`);
};

export const createFeedback = (
  data: CreateFeedbackParams
): Promise<Feedback> => {
  return fetchData<Feedback>(`/feedbacks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateFeedback = (
  id: string,
  data: UpdateFeedbackParams
): Promise<Feedback> => {
  return fetchData<Feedback>(`/feedbacks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteFeedback = (id: string): Promise<void> => {
  return fetchData(`/feedbacks/${id}`, {
    method: "DELETE",
  });
};

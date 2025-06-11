import {
  Feedback,
  CreateFeedbackDTO,
  UpdateFeedbackDTO,
  FeedbackResponse,
} from "../type/feedbacks";
import { fetchData } from "./api";

export const getFeedbacks = (): Promise<FeedbackResponse> => {
  return fetchData<FeedbackResponse>(`/feedbacks`);
};

export const getFeedbackById = (id: number): Promise<Feedback> => {
  return fetchData<Feedback>(`/feedbacks/${id}`);
};

export const createFeedback = (data: CreateFeedbackDTO): Promise<Feedback> => {
  return fetchData<Feedback>(`/feedbacks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateFeedback = (
  id: number,
  data: UpdateFeedbackDTO
): Promise<Feedback> => {
  return fetchData<Feedback>(`/feedbacks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteFeedback = (id: number): Promise<void> => {
  return fetchData(`/feedbacks/${id}`, {
    method: "DELETE",
  });
};

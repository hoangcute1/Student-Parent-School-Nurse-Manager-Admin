import { create } from "zustand";
import {
  CreateFeedbackParams,
  FeedbackStore,
  UpdateFeedbackParams,
} from "../type/feedbacks";
import { createFeedback, deleteFeedback, getFeedbacks, updateFeedback } from "@/lib/api/feedbacks";

export const useFeedbackStore = create<FeedbackStore>((set) => ({
  feedbacks: [],
  isLoading: false,
  error: null,
  total: 0,

  fetchFeedbacks: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getFeedbacks();
      const feedbacksList = Array.isArray(response)
        ? response
        : response.data || [];
      set({
        feedbacks: feedbacksList.map((feedback) => ({
          ...feedback,
        })),
        total: response.total || feedbacksList.length,
        error: null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch feedbacks",
        feedbacks: [],
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createFeedback: async (data: CreateFeedbackParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createFeedback(data);
      if (!response) throw new Error("Failed to create feedback");

      set((state) => ({
        feedbacks: [response, ...state.feedbacks],
        total: state.total + 1,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create feedback",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateFeedback: async (id: string, data: UpdateFeedbackParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateFeedback(id, data);
      if (response) {
        set((state) => ({
          feedbacks: state.feedbacks.map((feedback) =>
            feedback._id === id ? response : feedback
          ),
        }));
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update feedback",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFeedback: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteFeedback(id);
      set((state) => ({
        feedbacks: state.feedbacks.filter((feedback) => feedback._id !== id),
        total: state.total - 1,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete feedback",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  resetError: () => set({ error: null }),
}));

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

// Get feedbacks for a specific parent
export const getParentFeedbacks = async (
  parentId: string
): Promise<FeedbackResponse> => {
  try {
    console.log(
      "🔍 Fetching parent feedbacks from:",
      `http://localhost:3001/test/parent-feedbacks-no-auth/${parentId}`
    );

    const response = await fetch(
      `http://localhost:3001/test/parent-feedbacks-no-auth/${parentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("📊 Parent feedbacks data:", data);

    if (data.status === "success") {
      return {
        feedbacks: data.data || [],
        total: data.count || 0,
      };
    }
    throw new Error(data.message || "Failed to fetch parent feedbacks");
  } catch (error) {
    console.error("❌ Error fetching parent feedbacks:", error);
    throw error;
  }
};

// Get feedbacks for default parent (for testing)
export const getDefaultParentFeedbacks =
  async (): Promise<FeedbackResponse> => {
    try {
      console.log(
        "🔍 Fetching default parent feedbacks from:",
        "http://localhost:3001/test/parent-feedbacks-default"
      );

      const response = await fetch(
        "http://localhost:3001/test/parent-feedbacks-default",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 Default parent feedbacks data:", data);

      if (data.status === "success") {
        return {
          feedbacks: data.data || [],
          total: data.count || 0,
        };
      }
      throw new Error(
        data.message || "Failed to fetch default parent feedbacks"
      );
    } catch (error) {
      console.error("❌ Error fetching default parent feedbacks:", error);
      throw error;
    }
  };

// Get feedbacks without auth (for testing)
export const getFeedbacksNoAuth = async (): Promise<FeedbackResponse> => {
  try {
    console.log(
      "🔍 Fetching feedbacks from:",
      "http://localhost:3001/test/feedbacks-no-auth"
    );

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(
      "http://localhost:3001/test/feedbacks-no-auth",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);
    console.log("📡 Response status:", response.status);
    console.log("📡 Response ok:", response.ok);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("📊 Response data:", data);

    if (data.status === "success") {
      console.log(
        "✅ Successfully parsed",
        data.data?.length || 0,
        "feedbacks"
      );
      return {
        feedbacks: data.data || [],
        total: data.count || 0,
      };
    }
    throw new Error(data.message || "Failed to fetch feedbacks");
  } catch (error) {
    console.error("❌ Error fetching feedbacks:", error);

    // Add more detailed error information
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("⏰ Request was aborted (timeout)");
        throw new Error("Request timeout - server took too long to respond");
      }

      if (error.message.includes("Failed to fetch")) {
        console.error("🌐 Network error - cannot reach server");
        throw new Error(
          "Network error - cannot reach server. Please check if backend is running."
        );
      }
    }

    throw error;
  }
};

// Get responses for a feedback
export const getFeedbackResponses = async (feedbackId: string) => {
  try {
    const response = await fetch(
      "http://localhost:3001/test/responses-no-auth"
    );
    const data = await response.json();

    if (data.status === "success") {
      // Filter responses for this feedback
      return data.data.filter((resp: any) => resp.feedback === feedbackId);
    }
    throw new Error(data.message || "Failed to fetch responses");
  } catch (error) {
    console.error("Error fetching responses:", error);
    throw error;
  }
};

// Create a new feedback
export const createFeedback = async (
  data: CreateFeedbackParams
): Promise<Feedback> => {
  // Use test endpoint for now (no auth required)
  try {
    const response = await fetch(
      "http://localhost:3001/test/create-feedback-no-auth",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (result.status === "success") {
      return result.data.feedback;
    }
    throw new Error(result.message || "Failed to create feedback");
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw error;
  }
};

// Update an existing feedback
export const updateFeedback = async (
  id: string,
  data: UpdateFeedbackParams
): Promise<Feedback> => {
  try {
    // Use test endpoint for responding to feedback
    const response = await fetch(
      "http://localhost:3001/test/respond-feedback",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackId: id,
          responderId: "684d08d98e8c9994a5e1ff43", // Default staff ID
          response: data.response || "Đã tiếp nhận và xử lý yêu cầu của bạn.",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    }
    throw new Error(result.message || "Failed to update feedback");
  } catch (error) {
    console.error("Error updating feedback:", error);
    throw error;
  }
};

// Delete a feedback
export const deleteFeedback = async (id: string): Promise<void> => {
  return fetchData<void>(`/feedbacks/${id}`, {
    method: "DELETE",
  });
};

// Update feedback response
export const updateFeedbackResponse = async (
  id: string,
  data: { response: string; responderId: string }
): Promise<Feedback> => {
  try {
    const response = await fetch(
      `http://localhost:3001/test/update-feedback-response`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackId: id,
          responderId: data.responderId,
          response: data.response,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    }
    throw new Error(result.message || "Failed to update feedback response");
  } catch (error) {
    console.error("Error updating feedback response:", error);
    throw error;
  }
};

// Process feedback quickly (one-click processing)
export const processFeedback = async (
  feedbackId: string
): Promise<Feedback> => {
  try {
    const response = await fetch(
      "http://localhost:3001/test/process-feedback",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedbackId }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    }
    throw new Error(result.message || "Failed to process feedback");
  } catch (error) {
    console.error("Error processing feedback:", error);
    throw error;
  }
};

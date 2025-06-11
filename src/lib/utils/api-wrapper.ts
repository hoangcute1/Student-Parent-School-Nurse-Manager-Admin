type ApiResponse<T> = {
  data?: T;
  [key: string]: any;
};

export async function handleApiResponse<T>(
  promise: Promise<T | ApiResponse<T>>
): Promise<T> {
  try {
    const response = await promise;

    // Nếu response là array hoặc không có data property -> return luôn
    if (
      Array.isArray(response) ||
      typeof response !== "object" ||
      !response ||
      !("data" in response)
    ) {
      return response as T;
    }

    // Nếu có data property -> return data
    const typedResponse = response as ApiResponse<T>;
    return typedResponse.data || ([] as T);
  } catch (error: any) {
    // Xử lý lỗi chung
    if (error.response?.status === 401) {
      console.log("Unauthorized, redirecting to login...");
      // Có thể thêm redirect logic ở đây
    }
    throw error;
  }
}
